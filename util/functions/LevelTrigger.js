const discord = require("discord.js");
const GuildSchema = require("../../schema/GuildSchema");
const LevelService = require('./LevelService');

/**
 * Level Trigger - Handles XP gain from messages
 * Features: Cooldown system, level up notifications, role rewards
 * @param {import('discord.js').Message} message
 */
const levelTrigger = async (message, guildData = null) => {
  if (!message || message.author.bot || !message.guild) return;

  try {
    // Check if leveling is enabled
    const resolvedGuildData =
      guildData ?? await GuildSchema.findOne({ GuildID: message.guild.id }).lean();
    if (!resolvedGuildData?.Mod?.Level?.isEnabled) return;

    // Check cooldown
    if (LevelService.isOnCooldown(message.guild.id, message.author.id)) return;

    // Set cooldown
    LevelService.setCooldown(message.guild.id, message.author.id);

    // Add XP
    const xpAmount = LevelService.getRandomXp();
    const result = await LevelService.addXp(message.guild.id, message.author.id, xpAmount);

    // Handle level up
    if (result.leveledUp) {
      await handleLevelUp(message, result.newLevel, resolvedGuildData);
    }
  } catch (err) {
    console.error('[LevelTrigger] Error:', err);
  }
};

/**
 * Handle level up notifications and role rewards
 * @param {import('discord.js').Message} message
 * @param {number} newLevel
 * @param {Object} guildData
 */
async function handleLevelUp(message, newLevel, guildData) {
  const userData = await LevelService.getUserData(message.guild.id, message.author.id);
  
  // Send notification if enabled
  if (userData.notifications) {
    const embed = new discord.EmbedBuilder()
      .setAuthor({
        name: message.author.username,
        iconURL: message.author.displayAvatarURL({ dynamic: true, size: 2048 }),
      })
      .setDescription(
        ` ${message.author}, You leveled up to **Level ${newLevel}!**`
      )
      .setColor("DarkGreen")
      .setFooter({ text: `Keep chatting to reach level ${newLevel + 1}!` })
      .setTimestamp();

    try {
      const sentMessage = await message.channel.send({ embeds: [embed] });
      setTimeout(() => sentMessage.delete().catch(() => null), 15000);
    } catch (error) {
      console.error('[LevelTrigger] Failed to send level up message:', error);
    }
  }

  // Assign level roles if configured
  if (guildData.Mod?.Level?.Roles?.length > 0) {
    const levelRoles = guildData.Mod.Level.Roles
      .filter(r => r.Level <= newLevel)
      .sort((a, b) => b.Level - a.Level); // Highest level first

    // Get the highest level role the user qualifies for
    const highestRole = levelRoles[0];
    if (highestRole) {
      try {
        const role = message.guild.roles.cache.get(highestRole.RoleId);
        if (role && !message.member.roles.cache.has(role.id)) {
          await message.member.roles.add(role);
        }
      } catch (error) {
        console.error('[LevelTrigger] Failed to assign level role:', error);
      }
    }
  }
}

module.exports = levelTrigger;
