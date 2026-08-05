const { buildModerationEmbed } = require('../moderation/embeds');
const {
  isExempt, getGuildData, executeAction, sendLogEmbed, sendModerationEmbed,
  createTracker, getTrackerEntry, cleanOldMessages,
  hasZalgoText, extractUrls,
  isHandled, tryMarkHandled,
} = require('../moderation/core');

const spamTracker = createTracker();
const DUPLICATE_WINDOW = 30000; // 30 seconds

/** Calculate uppercase percentage */
function calculateCapsPercentage(text) {
  if (!text) return 0;
  const letters = text.replace(/[^a-zA-Z]/g, '');
  if (!letters.length) return 0;
  const upper = letters.replace(/[^A-Z]/g, '').length;
  return (upper / letters.length) * 100;
}

/** Count emojis in text */
function countEmojis(text) {
  return (text.match(/[\p{Emoji}]/gu) || []).length;
}

/** Count user & role mentions in text */
function countMentions(content) {
  return (content.match(/<@[&!]?\d+>/g) || []).length;
}

/** Count identical messages sent within the duplicate window */
function countRecentDuplicates(content, messages) {
  const cutoff = Date.now() - DUPLICATE_WINDOW;
  return messages.filter(m => m.timestamp > cutoff && m.content === content).length;
}

/** Detect repeated lines / copypasta spam */
function hasRepeatedLines(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length < 3) return false;
  const freq = {};
  for (const l of lines) freq[l] = (freq[l] || 0) + 1;
  return Object.values(freq).some(c => c >= 3);
}

/** Check spam behavior */
function checkSpam(content, tracker, config) {
  // Message rate limit
  if (config.maxMessagesPerMinute && tracker.messages.length >= config.maxMessagesPerMinute) {
    return { isSpam: true, reason: `Message rate limit: ${tracker.messages.length} messages/minute` };
  }

  // Caps lock check
  if (content.length >= (config.minCapsLength || 5)) {
    const caps = calculateCapsPercentage(content);
    if (caps >= (config.maxCapsPercentage || 70)) {
      return { isSpam: true, reason: `Excessive caps lock: ${Math.round(caps)}% uppercase` };
    }
  }

  // Emoji spam
  const emojiCount = countEmojis(content);
  if (emojiCount > (config.maxEmojis || 10)) {
    return { isSpam: true, reason: `Too many emojis: ${emojiCount} emojis` };
  }

  // Mention spam (users AND roles)
  if (config.maxMentions) {
    const mentions = countMentions(content);
    if (mentions > config.maxMentions) {
      return { isSpam: true, reason: `Mention spam: ${mentions} mentions` };
    }
  }

  // Link spam
  if (config.maxLinksPerMessage) {
    const links = extractUrls(content).length;
    if (links > config.maxLinksPerMessage) {
      return { isSpam: true, reason: `Too many links: ${links} links` };
    }
  }

  // Zalgo text
  if (hasZalgoText(content)) {
    return { isSpam: true, reason: 'Zalgo text detected (excessive combining characters)' };
  }

  // Repeated-lines / copypasta
  if (hasRepeatedLines(content)) {
    return { isSpam: true, reason: 'Repeated line spam detected' };
  }

  // Duplicate messages within a short window
  if (config.maxDuplicates) {
    const dups = countRecentDuplicates(content, tracker.messages);
    if (dups >= (config.maxDuplicates || 3)) {
      return { isSpam: true, reason: `Duplicate message spam: ${dups} duplicates` };
    }
  }

  return { isSpam: false, reason: '' };
}

/**
 * @param {import('../../struct/Client')} client
 * @param {import('discord.js').Message} message
 * @param {Object | null} guildData
 */
const antiSpam = async (client, message, guildData = null) => {
  if (!message || !message.guild || message.author.bot || message.author === client.user) return;
  if (isHandled(message)) return;

  const resolved = guildData || await getGuildData(client, message.guild.id);
  if (!resolved?.Mod?.AntiSpam?.isEnabled) return;

  const config = resolved.Mod.AntiSpam;
  if (isExempt(message, config)) return;

  // Track message
  const tracker = getTrackerEntry(spamTracker, `${message.guild.id}_${message.author.id}`);
  tracker.messages.push({ timestamp: Date.now(), content: message.content });
  cleanOldMessages(tracker);

  const result = checkSpam(message.content, tracker, config);

  if (result.isSpam) {
    if (!tryMarkHandled(message)) return;

    const action = config.action || 'delete';

    const logEmbed = buildModerationEmbed(client, message, {
      title: '⚠️ Spam Detected',
      reason: result.reason,
      action, moduleName: 'Anti-Spam',
      content: message.content,
    });
    await sendLogEmbed(message.guild, config.logChannel, logEmbed);

    await executeAction(client, message, action, result.reason, 'Anti-Spam');

    await sendModerationEmbed(client, message, {
      title: '⚠️ Spam Detected',
      reason: result.reason,
      action, moduleName: 'Anti-Spam',
      autoDelete: 5000,
    });
  }
};

/** Clear tracker for user */
function clearSpamTracker(guildId, userId) {
  spamTracker.delete(`${guildId}_${userId}`);
}

/** Clear all trackers for guild */
function clearGuildSpamTrackers(guildId) {
  for (const key of spamTracker.keys()) {
    if (key.startsWith(`${guildId}_`)) spamTracker.delete(key);
  }
}

module.exports = antiSpam;
module.exports.clearSpamTracker = clearSpamTracker;
module.exports.clearGuildSpamTrackers = clearGuildSpamTrackers;
