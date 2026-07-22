const { EmbedBuilder, PermissionsBitField } = require('discord.js');

/**
 * In-memory tracking for spam detection per user
 * Structure: Map<guildId_userId, { messages: Array<{timestamp, content}>, duplicateCount: number, lastContent: string }>
 */
const spamTracker = new Map();

/**
 * Get or create tracker for a user
 */
function getUserTracker(guildId, userId) {
  const key = `${guildId}_${userId}`;
  if (!spamTracker.has(key)) {
    spamTracker.set(key, { messages: [], duplicateCount: 0, lastContent: '' });
  }
  return spamTracker.get(key);
}

/**
 * Clean old messages from tracker (older than 1 minute)
 */
function cleanOldMessages(tracker) {
  const now = Date.now();
  const oneMinuteAgo = now - 60000;
  tracker.messages = tracker.messages.filter(msg => msg.timestamp > oneMinuteAgo);
}

/**
 * Calculate percentage of uppercase letters
 */
function calculateCapsPercentage(text) {
  if (text.length === 0) return 0;
  const letters = text.replace(/[^a-zA-Z]/g, '');
  if (letters.length === 0) return 0;
  const uppercase = letters.replace(/[^A-Z]/g, '').length;
  return (uppercase / letters.length) * 100;
}

/**
 * Count emojis in text
 */
function countEmojis(text) {
  const emojiRegex = /[\p{Emoji}]/gu;
  const matches = text.match(emojiRegex);
  return matches ? matches.length : 0;
}

/**
 * Check for spam behavior
 * @param {string} content
 * @param {Object} tracker
 * @param {Object} config
 * @returns {Object} - { isSpam: boolean, reason: string }
 */
function checkSpam(content, tracker, config) {
  // Check caps lock
  if (content.length >= config.minCapsLength) {
    const capsPercent = calculateCapsPercentage(content);
    if (capsPercent >= config.maxCapsPercentage) {
      return {
        isSpam: true,
        reason: `Excessive caps lock: ${Math.round(capsPercent)}% uppercase`
      };
    }
  }

  // Check emoji spam
  const emojiCount = countEmojis(content);
  if (emojiCount > config.maxEmojis) {
    return {
      isSpam: true,
      reason: `Too many emojis: ${emojiCount} emojis`
    };
  }

  // Check duplicate messages
  if (content === tracker.lastContent) {
    tracker.duplicateCount++;
    if (tracker.duplicateCount >= config.maxDuplicates) {
      return {
        isSpam: true,
        reason: `Duplicate message spam: ${tracker.duplicateCount} duplicates`
      };
    }
  } else {
    tracker.duplicateCount = 0;
    tracker.lastContent = content;
  }

  return { isSpam: false, reason: '' };
}

/**
 * Main anti-spam function to be called on message create
 * @param {import('../../struct/Client')} client
 * @param {import('discord.js').Message} message
 * @param {Object | null} guildData
 */
const antiSpam = async (client, message, guildData = null) => {
  if (!message || !message.guild) return;
  if (message.author.bot) return;
  if (message.author === client.user) return;

  let resolvedGuildData = guildData;

  try {
    if (!resolvedGuildData) {
      resolvedGuildData = await client.getCachedGuildData(message.guild.id);
    }
  } catch (err) {
    console.log(err);
    return;
  }

  if (!resolvedGuildData?.Mod?.AntiSpam?.isEnabled) return;

  // Skip owners and admins
  if (message.author.id === message.guild.ownerId) return;
  if (message.channel?.permissionsFor(message.member)?.has(PermissionsBitField.Flags.Administrator)) return;

  const antiSpamConfig = resolvedGuildData.Mod.AntiSpam;
  const guild = message.guild;
  const userId = message.author.id;

  // Track message
  const tracker = getUserTracker(guild.id, userId);
  tracker.messages.push({
    timestamp: Date.now(),
    content: message.content
  });

  cleanOldMessages(tracker);

  // Check for spam
  const checkResult = checkSpam(message.content, tracker, antiSpamConfig);

  if (checkResult.isSpam) {
    const action = antiSpamConfig.action;

    // Log to configured channel
    if (antiSpamConfig.logChannel) {
      const logChannel = guild.channels.cache.get(antiSpamConfig.logChannel);
      if (logChannel) {
        const embed = new EmbedBuilder()
          .setColor('#ff9900')
          .setTitle('⚠️ Spam Detected')
          .addFields(
            { name: 'User', value: `${message.author.tag} (${userId})`, inline: true },
            { name: 'Channel', value: `<#${message.channel.id}>`, inline: true },
            { name: 'Reason', value: checkResult.reason, inline: true },
            { name: 'Action', value: action, inline: true }
          )
          .setTimestamp();
        await logChannel.send({ embeds: [embed] }).catch(() => {});
      }
    }

    // Perform action
    if (action === 'delete') {
      await message.delete().catch(() => {});
      await message.channel.send({
        content: `🚫 ${message.author}, please stop spamming.`
      }).then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000)).catch(() => {});
    } else if (action === 'mute') {
      await message.delete().catch(() => {});
      if (message.member?.moderatable) {
        await message.member.timeout(600000, 'Anti-Spam: Spam detected').catch(async () => {
          const muteRole = guild.roles.cache.find(role => role.name === 'Muted');
          if (muteRole) {
            await message.member.roles.add(muteRole, 'Anti-Spam: Spam detected').catch(() => {});
          }
        });
      } else {
        const muteRole = guild.roles.cache.find(role => role.name === 'Muted');
        if (muteRole) {
          await message.member.roles.add(muteRole, 'Anti-Spam: Spam detected').catch(() => {});
        }
      }
      await message.channel.send({
        content: `🔒 ${message.author} has been muted for spamming.`
      }).then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000)).catch(() => {});
    } else if (action === 'warn') {
      await message.channel.send({
        content: `⚠️ ${message.author}, ${checkResult.reason}. Please stop spamming.`
      }).then(msg => setTimeout(() => msg.delete().catch(() => {}), 10000)).catch(() => {});
    }
  }
};

/**
 * Clear tracker for a user
 * @param {string} guildId
 * @param {string} userId
 */
function clearSpamTracker(guildId, userId) {
  const key = `${guildId}_${userId}`;
  spamTracker.delete(key);
}

/**
 * Clear all trackers for a guild
 * @param {string} guildId
 */
function clearGuildSpamTrackers(guildId) {
  for (const key of spamTracker.keys()) {
    if (key.startsWith(`${guildId}_`)) {
      spamTracker.delete(key);
    }
  }
}

module.exports = antiSpam;
module.exports.clearSpamTracker = clearSpamTracker;
module.exports.clearGuildSpamTrackers = clearGuildSpamTrackers;
