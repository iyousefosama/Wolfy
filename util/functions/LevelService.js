const LevelSchema = require('../../schema/LevelingSystem-Schema');
const { EmbedBuilder } = require('discord.js');

/**
 * Level Service - Unified level system utilities
 * Provides XP management, rank calculation, and level progression
 */
class LevelService {
  constructor() {
    // Cooldown map: guildId_userId -> lastMessageTime
    this.cooldowns = new Map();
    this.COOLDOWN_MS = 60000; // 1 minute cooldown
    this.BASE_XP = { min: 15, max: 25 };
  }

  /**
   * Get or create user level data
   * Handles migration from old nested schema to new flat schema
   * @param {string} guildId 
   * @param {string} userId 
   * @returns {Promise<Document>}
   */
  async getUserData(guildId, userId) {
    // First, check if document exists and has corrupted data using native query
    const corruptedDoc = await LevelSchema.collection.findOne({ 
      guildId, 
      userId,
      $or: [
        { xp: { $type: 'string' } },
        { level: { $type: 'string' } },
        { totalXp: { $type: 'string' } },
        { xp: NaN },
        { level: NaN },
        { totalXp: NaN }
      ]
    });
    
    if (corruptedDoc) {
      console.log(`[LevelService] Found corrupted data for user ${userId}, deleting...`);
      await LevelSchema.collection.deleteOne({ _id: corruptedDoc._id });
    }
    
    // Now try to find or create clean document
    let data = await LevelSchema.findOne({ guildId, userId });
    
    if (!data) {
      // Create new document with new schema
      return await LevelSchema.create({
        guildId,
        userId,
        level: 1,
        xp: 0,
        requiredXp: this.calculateRequiredXp(1),
        totalXp: 0,
        messageCount: 0
      });
    }
    
    // Check if this is an old document with nested System structure
    const rawData = data.toObject();
    const isOldSchema = rawData.System !== undefined && 
                       rawData.System !== null &&
                       typeof rawData.System === 'object';
    
    if (isOldSchema) {
      console.log(`[LevelService] Migrating old schema for user ${userId}`);
      const oldLevel = parseInt(rawData.System?.level) || 1;
      const oldXp = parseInt(rawData.System?.xp) || 0;
      
      // Delete old document
      await LevelSchema.deleteOne({ _id: data._id });
      
      // Calculate total XP
      let totalXp = 0;
      for (let i = 1; i < oldLevel; i++) {
        totalXp += this.calculateRequiredXp(i);
      }
      totalXp += oldXp;
      
      // Create fresh document
      return await LevelSchema.create({
        guildId,
        userId,
        level: oldLevel,
        xp: oldXp,
        requiredXp: this.calculateRequiredXp(oldLevel),
        totalXp: totalXp,
        messageCount: 0,
        notifications: true
      });
    }
    
    return data;
  }

  /**
   * Calculate required XP for a level
   * Formula: 100 * level² + 50 * level
   * @param {number} level 
   * @returns {number}
   */
  calculateRequiredXp(level) {
    return Math.floor(100 * Math.pow(level, 2) + 50 * level);
  }

  /**
   * Calculate total XP needed to reach a level from level 1
   * @param {number} targetLevel 
   * @returns {number}
   */
  calculateTotalXpForLevel(targetLevel) {
    let total = 0;
    for (let i = 1; i < targetLevel; i++) {
      total += this.calculateRequiredXp(i);
    }
    return total;
  }

  /**
   * Check if user is on cooldown
   * @param {string} guildId 
   * @param {string} userId 
   * @returns {boolean}
   */
  isOnCooldown(guildId, userId) {
    const key = `${guildId}_${userId}`;
    const lastMessage = this.cooldowns.get(key);
    
    if (!lastMessage) return false;
    
    return Date.now() - lastMessage < this.COOLDOWN_MS;
  }

  /**
   * Set cooldown for user
   * @param {string} guildId 
   * @param {string} userId 
   */
  setCooldown(guildId, userId) {
    const key = `${guildId}_${userId}`;
    this.cooldowns.set(key, Date.now());
    
    // Cleanup old entries periodically
    if (this.cooldowns.size > 10000) {
      this.cleanupCooldowns();
    }
  }

  /**
   * Cleanup old cooldown entries
   */
  cleanupCooldowns() {
    const now = Date.now();
    for (const [key, time] of this.cooldowns.entries()) {
      if (now - time > this.COOLDOWN_MS * 2) {
        this.cooldowns.delete(key);
      }
    }
  }

  /**
   * Generate random XP amount
   * @param {number} multiplier - XP multiplier (default: 1)
   * @returns {number}
   */
  getRandomXp(multiplier = 1) {
    const base = Math.floor(Math.random() * (this.BASE_XP.max - this.BASE_XP.min + 1)) + this.BASE_XP.min;
    return Math.floor(base * multiplier);
  }

  /**
   * Add XP to user and handle level ups
   * @param {string} guildId 
   * @param {string} userId 
   * @param {number} amount 
   * @returns {Promise<{leveledUp: boolean, newLevel?: number, oldLevel?: number}>}
   */
  async addXp(guildId, userId, amount) {
    const data = await this.getUserData(guildId, userId);
    
    // Extra defensive: ensure we have a valid Mongoose document
    if (!data || !data.save) {
      throw new Error('Failed to get valid user data');
    }
    
    const oldLevel = data.level;
    
    // Ensure all values are valid numbers before adding
    const currentXp = Number(data.xp) || 0;
    const currentTotalXp = Number(data.totalXp) || 0;
    const currentMsgCount = Number(data.messageCount) || 0;
    
    // Add XP
    data.xp = currentXp + amount;
    data.totalXp = currentTotalXp + amount;
    data.messageCount = currentMsgCount + 1;
    
    let leveledUp = false;
    
    // Check for level up(s)
    while (data.xp >= data.requiredXp) {
      data.xp -= data.requiredXp;
      data.level += 1;
      data.requiredXp = this.calculateRequiredXp(data.level);
      leveledUp = true;
    }
    
    // Try to save, if it fails due to validation error, reset user data
    try {
      await data.save();
    } catch (saveError) {
      if (saveError.name === 'ValidationError') {
        console.error(`[LevelService] Save failed for user ${userId}, resetting data:`, saveError.message);
        await LevelSchema.deleteOne({ guildId, userId });
        
        // Create fresh data with the XP they just earned
        const freshData = await LevelSchema.create({
          guildId,
          userId,
          level: 1,
          xp: amount,
          requiredXp: this.calculateRequiredXp(1),
          totalXp: amount,
          messageCount: 1
        });
        
        return {
          leveledUp: false,
          currentXp: freshData.xp,
          requiredXp: freshData.requiredXp,
          level: freshData.level,
          totalXp: freshData.totalXp
        };
      }
      throw saveError;
    }
    
    return {
      leveledUp,
      oldLevel: leveledUp ? oldLevel : undefined,
      newLevel: leveledUp ? data.level : undefined,
      currentXp: data.xp,
      requiredXp: data.requiredXp,
      level: data.level,
      totalXp: data.totalXp
    };
  }

  /**
   * Get user's rank in the guild
   * @param {string} guildId 
   * @param {string} userId 
   * @returns {Promise<number>}
   */
  async getUserRank(guildId, userId) {
    const userData = await this.getUserData(guildId, userId);
    const totalXp = this.calculateTotalXpForLevel(userData.level) + userData.xp;
    
    // Count users with more total XP
    const higherRanked = await LevelSchema.countDocuments({
      guildId,
      $or: [
        { totalXp: { $gt: totalXp } },
        { 
          totalXp: totalXp,
          level: { $gt: userData.level }
        }
      ]
    });
    
    return higherRanked + 1;
  }

  /**
   * Get leaderboard data
   * @param {string} guildId 
   * @param {number} limit 
   * @returns {Promise<Array>}
   */
  async getLeaderboard(guildId, limit = 10, skip = 0) {
    return await LevelSchema.find({ guildId })
      .sort({ totalXp: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
  }

  async getLeaderboardCount(guildId) {
    return LevelSchema.countDocuments({ guildId });
  }

  /**
   * Set user level directly (admin command)
   * @param {string} guildId 
   * @param {string} userId 
   * @param {number} level 
   * @returns {Promise<Object>}
   */
  async setLevel(guildId, userId, level) {
    const data = await this.getUserData(guildId, userId);
    
    data.level = Math.max(1, level);
    data.xp = 0;
    data.requiredXp = this.calculateRequiredXp(data.level);
    data.totalXp = this.calculateTotalXpForLevel(data.level);
    
    await data.save();
    
    return {
      level: data.level,
      xp: data.xp,
      requiredXp: data.requiredXp
    };
  }

  /**
   * Add XP directly (admin command)
   * @param {string} guildId 
   * @param {string} userId 
   * @param {number} amount 
   * @returns {Promise<Object>}
   */
  async addXpDirect(guildId, userId, amount) {
    return await this.addXp(guildId, userId, amount);
  }

  /**
   * Reset user data
   * @param {string} guildId 
   * @param {string} userId 
   * @returns {Promise<void>}
   */
  async resetUser(guildId, userId) {
    await LevelSchema.findOneAndDelete({ guildId, userId });
  }

  /**
   * Reset entire guild
   * @param {string} guildId 
   * @returns {Promise<void>}
   */
  async resetGuild(guildId) {
    await LevelSchema.deleteMany({ guildId });
  }

  /**
   * Toggle notifications for user
   * @param {string} guildId 
   * @param {string} userId 
   * @returns {Promise<boolean>} - New notification state
   */
  async toggleNotifications(guildId, userId) {
    const data = await this.getUserData(guildId, userId);
    data.notifications = !data.notifications;
    await data.save();
    return data.notifications;
  }

  /**
   * Get progress percentage
   * @param {number} currentXp 
   * @param {number} requiredXp 
   * @returns {number}
   */
  getProgressPercentage(currentXp, requiredXp) {
    return Math.min(100, Math.round((currentXp / requiredXp) * 100));
  }

  /**
   * Create progress bar
   * @param {number} percentage 
   * @param {number} length 
   * @returns {string}
   */
  createProgressBar(percentage, length = 10) {
    const filled = Math.round((percentage / 100) * length);
    const empty = length - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
  }

  /**
   * Build rank embed (text fallback when image generation fails)
   * @param {Object} user - Discord user object
   * @param {Object} rankData 
   * @returns {EmbedBuilder}
   */
  buildRankEmbed(user, rankData) {
    const progress = this.getProgressPercentage(rankData.currentXp, rankData.requiredXp);
    const progressBar = this.createProgressBar(progress);
    
    return new EmbedBuilder()
      .setColor('#FF9900')
      .setTitle(`📊 ${user.username}'s Rank`)
      .setThumbnail(user.displayAvatarURL({ extension: 'png', size: 256 }))
      .addFields(
        { name: '🏆 Rank', value: `#${rankData.rank}`, inline: true },
        { name: '📈 Level', value: `${rankData.level}`, inline: true },
        { name: '💬 Messages', value: `${rankData.messageCount?.toLocaleString() || 'N/A'}`, inline: true },
        { name: '⭐ Current XP', value: `${rankData.currentXp.toLocaleString()}`, inline: true },
        { name: '🎯 Required XP', value: `${rankData.requiredXp.toLocaleString()}`, inline: true },
        { name: '📊 Total XP', value: `${rankData.totalXp.toLocaleString()}`, inline: true },
        { name: '📈 Progress', value: `${progressBar} ${progress}%`, inline: false }
      )
      .setFooter({ text: 'Keep chatting to earn more XP!' })
      .setTimestamp();
  }

  /**
   * Check and assign level roles
   * @param {import('discord.js').GuildMember} member 
   * @param {number} level 
   * @param {Array} levelRoles - Array of {level, roleId} objects
   */
  async assignLevelRoles(member, level, levelRoles = []) {
    const rolesToAdd = [];
    
    for (const roleData of levelRoles) {
      if (level >= roleData.level) {
        const role = member.guild.roles.cache.get(roleData.roleId);
        if (role && !member.roles.cache.has(role.id)) {
          rolesToAdd.push(role);
        }
      }
    }
    
    if (rolesToAdd.length > 0) {
      try {
        await member.roles.add(rolesToAdd);
      } catch (error) {
        console.error('Failed to assign level roles:', error);
      }
    }
    
    return rolesToAdd;
  }
}

// Export singleton instance
module.exports = new LevelService();
