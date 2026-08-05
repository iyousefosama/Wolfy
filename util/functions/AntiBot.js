const { buildModerationEmbed } = require('../moderation/embeds');
const {
  isExempt, getGuildData, executeAction, sendLogEmbed, sendModerationEmbed,
  createTracker, getTrackerEntry, cleanOldMessages,
  extractUrls, isHandled, tryMarkHandled,
} = require('../moderation/core');

const botTracker = createTracker();

/** Check suspicious bot-like behavior */
function checkSuspiciousBehavior(guildId, userId, config, tracker) {
  // Message rate check
  if (config.maxMessagesPerMinute && tracker.messages.length >= config.maxMessagesPerMinute) {
    return { isSuspicious: true, reason: `High message rate: ${tracker.messages.length} messages/minute`, actionRequired: true };
  }

  // Same link spam
  for (const [link, count] of tracker.linkCount.entries()) {
    if (config.maxSameLinks && count >= config.maxSameLinks) {
      return { isSuspicious: true, reason: `Spamming same link: ${link} (${count} times)`, actionRequired: true };
    }
  }

  // Suspicious patterns in recent messages
  if (config.suspiciousPatterns?.length > 0) {
    const recent = tracker.messages.slice(-5);
    for (const msg of recent) {
      for (const pattern of config.suspiciousPatterns) {
        try {
          if (new RegExp(pattern, 'i').test(msg.content)) {
            return { isSuspicious: true, reason: `Suspicious pattern detected: ${pattern}`, actionRequired: true };
          }
        } catch { /* invalid regex */ }
      }
    }
  }

  return { isSuspicious: false, reason: '', actionRequired: false };
}

/**
 * @param {import('../../struct/Client')} client
 * @param {import('discord.js').Message} message
 * @param {Object | null} guildData
 */
const antiBot = async (client, message, guildData = null) => {
  if (!message || !message.guild || message.author.bot || message.author === client.user) return;
  if (isHandled(message)) return;

  const resolved = guildData || await getGuildData(client, message.guild.id);
  if (!resolved?.Mod?.AntiBot?.isEnabled) return;

  const config = resolved.Mod.AntiBot;
  if (isExempt(message, config)) return;

  // Check account age
  if (config.minAccountAge) {
    const accountAge = Date.now() - message.author.createdTimestamp;
    if (accountAge < config.minAccountAge) {
      if (!tryMarkHandled(message)) return;
      const action = config.action || 'mute';
      const reason = `Account too new (${Math.round(accountAge / 3600000)}h old)`;

      const logEmbed = buildModerationEmbed(client, message, {
        title: '🤖 Suspicious Account Detected',
        reason, action, moduleName: 'Anti-Bot',
        content: message.content,
      });
      await sendLogEmbed(message.guild, config.logChannel, logEmbed);

      await executeAction(client, message, action, reason, 'Anti-Bot');
      await sendModerationEmbed(client, message, {
        title: '🤖 Suspicious Account Detected',
        reason, action, moduleName: 'Anti-Bot',
        autoDelete: 5000,
      });
      return;
    }
  }

  // Check verified email
  if (config.requireVerified && !message.author.flags?.has('VerifiedEmail')) {
    if (!tryMarkHandled(message)) return;
    const action = config.action || 'mute';
    const reason = 'Account does not have a verified email';

    const logEmbed = buildModerationEmbed(client, message, {
      title: '🤖 Unverified Account',
      reason, action, moduleName: 'Anti-Bot',
      content: message.content,
    });
    await sendLogEmbed(message.guild, config.logChannel, logEmbed);

    await executeAction(client, message, action, reason, 'Anti-Bot');
    await sendModerationEmbed(client, message, {
      title: '🤖 Unverified Account',
      reason, action, moduleName: 'Anti-Bot',
      autoDelete: 5000,
    });
    return;
  }

  // Track message
  const tracker = getTrackerEntry(botTracker, `${message.guild.id}_${message.author.id}`);
  const urls = extractUrls(message.content);

  tracker.messages.push({ timestamp: Date.now(), content: message.content });
  cleanOldMessages(tracker);

  for (const url of urls) {
    tracker.linkCount.set(url, (tracker.linkCount.get(url) || 0) + 1);
  }

  const result = checkSuspiciousBehavior(message.guild.id, message.author.id, config, tracker);

  if (result.actionRequired) {
    if (!tryMarkHandled(message)) return;
    const action = config.action || 'mute';

    const logEmbed = buildModerationEmbed(client, message, {
      title: '🤖 Potential Compromised Account Detected',
      reason: result.reason,
      action, moduleName: 'Anti-Bot',
      content: message.content,
    });
    await sendLogEmbed(message.guild, config.logChannel, logEmbed);

    await executeAction(client, message, action, result.reason, 'Anti-Bot');

    await sendModerationEmbed(client, message, {
      title: '🤖 Potential Compromised Account Detected',
      reason: result.reason,
      action, moduleName: 'Anti-Bot',
      autoDelete: 5000,
    });

    // Clear tracker
    botTracker.delete(`${message.guild.id}_${message.author.id}`);
  }
};

/** Clear tracker for user */
function clearBotTracker(guildId, userId) {
  botTracker.delete(`${guildId}_${userId}`);
}

/** Clear all trackers for guild */
function clearGuildBotTrackers(guildId) {
  for (const key of botTracker.keys()) {
    if (key.startsWith(`${guildId}_`)) botTracker.delete(key);
  }
}

module.exports = antiBot;
module.exports.clearBotTracker = clearBotTracker;
module.exports.clearGuildBotTrackers = clearGuildBotTrackers;
