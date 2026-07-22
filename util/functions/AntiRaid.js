const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const dayjs = require('dayjs');

/**
 * In-memory tracking for raid detection per guild
 * Structure: Map<guildId, { joins: Array<{timestamp, userId}>, lockdownActive: boolean, lockdownStart: number }>
 */
const raidTracker = new Map();

/**
 * Check if a raid is detected based on join rate
 * @param {string} guildId 
 * @param {number} maxJoinsPerMinute 
 * @returns {boolean}
 */
function isRaidDetected(guildId, maxJoinsPerMinute) {
  const tracker = raidTracker.get(guildId);
  if (!tracker) return false;

  const now = Date.now();
  const oneMinuteAgo = now - 60000;

  // Filter joins from the last minute
  const recentJoins = tracker.joins.filter(join => join.timestamp > oneMinuteAgo);

  // Update tracker with filtered joins
  tracker.joins = recentJoins;
  raidTracker.set(guildId, tracker);

  return recentJoins.length >= maxJoinsPerMinute;
}

/**
 * Activate lockdown mode for a guild
 * @param {import('../../struct/Client')} client
 * @param {import('discord.js').Guild} guild
 * @param {Object} config
 */
async function activateLockdown(client, guild, config) {
  const tracker = raidTracker.get(guild.id);
  if (!tracker || tracker.lockdownActive) return;

  tracker.lockdownActive = true;
  tracker.lockdownStart = Date.now();
  raidTracker.set(guild.id, tracker);

  // Log to configured channel
  if (config.logChannel) {
    const logChannel = guild.channels.cache.get(config.logChannel);
    if (logChannel) {
      const lockdownEmbed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('🚨 RAID DETECTED - LOCKDOWN ACTIVATED')
        .setDescription('Server has been locked down due to suspicious join activity.')
        .addFields(
          { name: 'Duration', value: `${config.lockdownDuration / 1000} seconds`, inline: true },
          { name: 'Action', value: config.action, inline: true }
        )
        .setTimestamp();
      await logChannel.send({ embeds: [lockdownEmbed] }).catch(() => {});
    }
  }

  // Set lockdown duration
  setTimeout(() => {
    deactivateLockdown(client, guild, config);
  }, config.lockdownDuration);
}

/**
 * Deactivate lockdown mode for a guild
 * @param {import('../../struct/Client')} client
 * @param {import('discord.js').Guild} guild
 * @param {Object} config
 */
async function deactivateLockdown(client, guild, config) {
  const tracker = raidTracker.get(guild.id);
  if (!tracker) return;

  tracker.lockdownActive = false;
  tracker.lockdownStart = null;
  raidTracker.set(guild.id, tracker);

  // Log to configured channel
  if (config.logChannel) {
    const logChannel = guild.channels.cache.get(config.logChannel);
    if (logChannel) {
      const unlockEmbed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('✅ LOCKDOWN DEACTIVATED')
        .setDescription('Server lockdown has been lifted.')
        .setTimestamp();
      await logChannel.send({ embeds: [unlockEmbed] }).catch(() => {});
    }
  }
}

/**
 * Main anti-raid function to be called on guild member add
 * @param {import('../../struct/Client')} client
 * @param {import('discord.js').GuildMember} member
 * @param {Object | null} guildData
 */
const antiRaid = async (client, member, guildData = null) => {
  if (!member || !member.guild) return;

  let resolvedGuildData = guildData;

  try {
    if (!resolvedGuildData) {
      resolvedGuildData = await client.getCachedGuildData(member.guild.id);
    }
  } catch (err) {
    console.log(err);
    return;
  }

  if (!resolvedGuildData?.Mod?.AntiRaid?.isEnabled) return;

  const antiRaidConfig = resolvedGuildData.Mod.AntiRaid;
  const guild = member.guild;

  // Initialize tracker for this guild if not exists
  if (!raidTracker.has(guild.id)) {
    raidTracker.set(guild.id, { joins: [], lockdownActive: false, lockdownStart: null });
  }

  const tracker = raidTracker.get(guild.id);

  // Check account age
  const accountAge = Date.now() - member.user.createdTimestamp;
  if (accountAge < antiRaidConfig.minAccountAge) {
    const action = antiRaidConfig.action;

    // Log to configured channel
    if (antiRaidConfig.logChannel) {
      const logChannel = guild.channels.cache.get(antiRaidConfig.logChannel);
      if (logChannel) {
        const embed = new EmbedBuilder()
          .setColor('#ff9900')
          .setTitle('⚠️ Suspicious Account Detected')
          .addFields(
            { name: 'User', value: `${member.user.tag} (${member.user.id})`, inline: true },
            { name: 'Account Age', value: dayjs(member.user.createdAt).fromNow(), inline: true },
            { name: 'Action', value: action, inline: true }
          )
          .setTimestamp();
        await logChannel.send({ embeds: [embed] }).catch(() => {});
      }
    }

    // Perform action
    if (action === 'kick') {
      if (member.kickable) await member.kick('Anti-Raid: Account too new').catch(() => {});
    } else if (action === 'ban') {
      if (member.bannable) await member.ban({ reason: 'Anti-Raid: Account too new' }).catch(() => {});
    } else if (action === 'mute') {
      if (member.moderatable) {
        await member.timeout(600000, 'Anti-Raid: Account too new').catch(async () => {
          const muteRole = guild.roles.cache.find(role => role.name === 'Muted');
          if (muteRole) await member.roles.add(muteRole, 'Anti-Raid: Account too new').catch(() => {});
        });
      } else {
        const muteRole = guild.roles.cache.find(role => role.name === 'Muted');
        if (muteRole) await member.roles.add(muteRole, 'Anti-Raid: Account too new').catch(() => {});
      }
    }
    return;
  }

  // Track join
  tracker.joins.push({ timestamp:(Date.now()), userId: member.id });
  raidTracker.set(guild.id, tracker);

  // Check for raid
  if (isRaidDetected(guild.id, antiRaidConfig.maxJoinsPerMinute)) {
    await activateLockdown(client, guild, antiRaidConfig);
  }

  // If lockdown is active, take action against new joins
  if (tracker.lockdownActive) {
    const action = antiRaidConfig.action;

    if (action === 'kick') {
      if (member.kickable) await member.kick('Anti-Raid: Lockdown active').catch(() => {});
    } else if (action === 'ban') {
      if (member.bannable) await member.ban({ reason: 'Anti-Raid: Lockdown active' }).catch(() => {});
    } else if (action === 'mute') {
      if (member.moderatable) {
        await member.timeout(600000, 'Anti-Raid: Lockdown active').catch(async () => {
          const muteRole = guild.roles.cache.find(role => role.name === 'Muted');
          if (muteRole) await member.roles.add(muteRole, 'Anti-Raid: Lockdown active').catch(() => {});
        });
      } else {
        const muteRole = guild.roles.cache.find(role => role.name === 'Muted');
        if (muteRole) await member.roles.add(muteRole, 'Anti-Raid: Lockdown active').catch(() => {});
      }
    }
  }
};

/**
 * Clear tracker for a guild (useful for testing or manual reset)
 * @param {string} guildId
 */
function clearRaidTracker(guildId) {
  raidTracker.delete(guildId);
}

module.exports = antiRaid;
module.exports.clearRaidTracker = clearRaidTracker;
module.exports.isRaidDetected = isRaidDetected;
