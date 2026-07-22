const { EmbedBuilder, PermissionsBitField } = require('discord.js');

/**
 * In-memory tracking for bot detection per user
 * Structure: Map<guildId_userId, { messages: Array<{timestamp, content, links}>, linkCount: Map<link, count> }>
 */
const botTracker = new Map();

/**
 * Extract URLs from message content
 */
function extractUrls(content) {
  const urlRegex = /(https?:\/\/[^\s]+)|(discord\.gg\/[^\s]+)/gi;
  return content.match(urlRegex) || [];
}

/**
 * Get or create tracker for a user
 */
function getUserTracker(guildId, userId) {
  const key = `${guildId}_${userId}`;
  if (!botTracker.has(key)) {
    botTracker.set(key, { messages: [], linkCount: new Map() });
  }
  return botTracker.get(key);
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
 * Check if user is sending suspicious bot-like behavior
 * @param {string} guildId
 * @param {string} userId
 * @param {Object} config
 * @returns {Object} - { isSuspicious: boolean, reason: string, actionRequired: boolean }
 */
function checkSuspiciousBehavior(guildId, userId, config) {
  const tracker = getUserTracker(guildId, userId);
  cleanOldMessages(tracker);

  const messagesPerMinute = tracker.messages.length;

  // Check message rate
  if (messagesPerMinute >= config.maxMessagesPerMinute) {
    return {
      isSuspicious: true,
      reason: `High message rate: ${messagesPerMinute} messages per minute`,
      actionRequired: true
    };
  }

  // Check for same link spam
  for (const [link, count] of tracker.linkCount.entries()) {
    if (count >= config.maxSameLinks) {
      return {
        isSuspicious: true,
        reason: `Spamming same link: ${link} (${count} times)`,
        actionRequired: true
      };
    }
  }

  // Check for suspicious patterns
  if (config.suspiciousPatterns && config.suspiciousPatterns.length > 0) {
    const recentMessages = tracker.messages.slice(-5); // Check last 5 messages
    for (const msg of recentMessages) {
      for (const pattern of config.suspiciousPatterns) {
        try {
          const regex = new RegExp(pattern, 'i');
          if (regex.test(msg.content)) {
            return {
              isSuspicious: true,
              reason: `Suspicious pattern detected: ${pattern}`,
              actionRequired: true
            };
          }
        } catch (e) {
          // Invalid regex, skip
        }
      }
    }
  }

  return { isSuspicious: false, reason: '', actionRequired: false };
}

/**
 * Main anti-bot function to be called on message create
 * @param {import('../../struct/Client')} client
 * @param {import('discord.js').Message} message
 * @param {Object | null} guildData
 */
const antiBot = async (client, message, guildData = null) => {
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

  if (!resolvedGuildData?.Mod?.AntiBot?.isEnabled) return;

  // Skip owners and admins
  if (message.author.id === message.guild.ownerId) return;
  if (message.channel?.permissionsFor(message.member)?.has(PermissionsBitField.Flags.Administrator)) return;

  const antiBotConfig = resolvedGuildData.Mod.AntiBot;
  const guild = message.guild;
  const userId = message.author.id;

  // Track message
  const tracker = getUserTracker(guild.id, userId);
  const urls = extractUrls(message.content);
  
  tracker.messages.push({
    timestamp: Date.now(),
    content: message.content,
    links: urls
  });

  // Track link counts
  for (const url of urls) {
    const currentCount = tracker.linkCount.get(url) || 0;
    tracker.linkCount.set(url, currentCount + 1);
  }

  // Check for suspicious behavior
  const checkResult = checkSuspiciousBehavior(guild.id, userId, antiBotConfig);

  if (checkResult.actionRequired) {
    const action = antiBotConfig.action;

    // Log to configured channel
    if (antiBotConfig.logChannel) {
      const logChannel = guild.channels.cache.get(antiBotConfig.logChannel);
      if (logChannel) {
        const embed = new EmbedBuilder()
          .setColor('#ff0000')
          .setTitle('🤖 Potential Compromised Account Detected')
          .addFields(
            { name: 'User', value: `${message.author.tag} (${userId})`, inline: true },
            { name: 'Channel', value: `<#${message.channel.id}>`, inline: true },
            { name: 'Reason', value: checkResult.reason, inline: true },
            { name: 'Message Rate', value: `${tracker.messages.length}/min`, inline: true },
            { name: 'Action', value: action, inline: true }
          )
          .setTimestamp();
        await logChannel.send({ embeds: [embed] }).catch(() => {});
      }
    }

    // Perform action
    if (action === 'mute') {
      let muted = false;
      if (message.member?.moderatable) {
        await message.member.timeout(600000, 'Anti-Bot: Suspicious behavior detected').then(() => { muted = true; }).catch(() => {});
      }
      if (!muted) {
        const muteRole = guild.roles.cache.find(role => role.name === 'Muted');
        if (muteRole) {
          await message.member.roles.add(muteRole, 'Anti-Bot: Suspicious behavior detected').then(() => { muted = true; }).catch(() => {});
        }
      }
      await message.channel.send({
        content: `🔒 ${message.author} has been muted due to suspicious bot-like behavior.`
      }).catch(() => {});
    } else if (action === 'kick') {
      if (message.member?.kickable) {
        await message.member.kick('Anti-Bot: Suspicious behavior detected').catch(() => {});
      }
    } else if (action === 'ban') {
      if (message.member?.bannable) {
        await message.member.ban({ reason: 'Anti-Bot: Suspicious behavior detected' }).catch(() => {});
      }
    }

    // Delete suspicious messages
    try {
      await message.delete();
      // Try to delete recent messages from this user
      const channelMessages = await message.channel.messages.fetch({ limit: 20 });
      const userMessages = channelMessages.filter(m => m.author.id === userId);
      await message.channel.bulkDelete(userMessages).catch(() => {});
    } catch (e) {
      // Ignore deletion errors
    }

    // Clear tracker for this user
    botTracker.delete(`${guild.id}_${userId}`);
  }
};

/**
 * Clear tracker for a user
 * @param {string} guildId
 * @param {string} userId
 */
function clearBotTracker(guildId, userId) {
  const key = `${guildId}_${userId}`;
  botTracker.delete(key);
}

/**
 * Clear all trackers for a guild
 * @param {string} guildId
 */
function clearGuildBotTrackers(guildId) {
  for (const key of botTracker.keys()) {
    if (key.startsWith(`${guildId}_`)) {
      botTracker.delete(key);
    }
  }
}

module.exports = antiBot;
module.exports.clearBotTracker = clearBotTracker;
module.exports.clearGuildBotTrackers = clearGuildBotTrackers;
