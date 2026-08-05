const { buildModerationEmbed } = require('../moderation/embeds');
const {
  extractDomain, isExempt, getGuildData,
  executeAction, sendLogEmbed, sendModerationEmbed,
  extractMessageUrls, detectObfuscatedUrls,
  isTrustedDomain, analyzeUrl, hasScamText,
  isHandled, tryMarkHandled, createTracker, getTrackerEntry,
} = require('../moderation/core');

/** A URL is considered a scam when its score reaches this threshold */
const SCAM_THRESHOLD = 90;

/** Repeat offenders escalate their action within this window */
const VIOLATION_WINDOW = 10 * 60 * 1000; // 10 minutes
const ACTION_ORDER = ['delete', 'warn', 'mute', 'kick', 'ban'];
const linkTracker = createTracker();

/** Escalate action for repeat scam/spam offenders */
function computeAction(baseAction, violations) {
  const base = ACTION_ORDER.indexOf(baseAction);
  if (base === -1) return baseAction;
  const recent = violations.filter(v => Date.now() - v < VIOLATION_WINDOW).length;
  let step = 0;
  if (recent >= 4) step = 2;
  else if (recent >= 2) step = 1;
  return ACTION_ORDER[Math.min(base + step, ACTION_ORDER.length - 1)];
}

/** Clean expired violations from the tracker */
function cleanOldViolations(tracker, window = VIOLATION_WINDOW) {
  if (Array.isArray(tracker.violations)) {
    tracker.violations = tracker.violations.filter(v => Date.now() - v < window);
  }
}

/** Is a domain allowed by the server's allow-lists (whitelist / allowedDomains) */
function isAllowedDomain(domain, url, config) {
  const lists = [...(config.whitelist || []), ...(config.allowedDomains || [])];
  if (!lists.length) return false;
  const d = (domain || '').toLowerCase();
  const u = (url || '').toLowerCase();
  return lists.some(a => a && (d.includes(a.toLowerCase()) || u.includes(a.toLowerCase())));
}

/**
 * @param {import('../../struct/Client')} client
 * @param {import('discord.js').Message} message
 * @param {Object | null} guildData
 */
const checkMsg = async (client, message, guildData = null) => {
  if (!message || !message.guild) return;
  if (message.author === client.user || message.author.bot) return;
  if (isHandled(message)) return;

  const resolved = guildData || await getGuildData(client, message.guild.id);
  if (!resolved?.Mod?.AntiLink?.isEnabled) return;

  const config = resolved.Mod.AntiLink;
  if (isExempt(message, config)) return;

  const urls = extractMessageUrls(message);
  const obfuscated = detectObfuscatedUrls(message.content || '');
  if (urls.length === 0 && obfuscated.length === 0) return;

  const mode = config.mode || 'scam';
  const blocks = [];

  for (const url of urls) {
    const domain = extractDomain(url)?.toLowerCase() || '';
    const bl = config.blacklist || [];

    // Allow-lists always win
    if (isAllowedDomain(domain, url, config)) continue;

    // Blacklist always blocked
    const blHit = bl.some(b => b && (domain.includes(b.toLowerCase()) || url.toLowerCase().includes(b.toLowerCase())));
    if (blHit) {
      blocks.push({ url, reason: 'Blacklisted domain detected', reasons: [`\`${domain}\` is blacklisted`] });
      continue;
    }

    if (mode === 'strict') {
      blocks.push({ url, reason: 'Links are disabled in this server', reasons: [] });
    } else if (mode === 'whitelist') {
      blocks.push({ url, reason: 'Link is not allowed in this server', reasons: [`\`${domain}\` is not in the allow-list`] });
    } else if (mode === 'scam') {
      if (config.scamDetection !== false) {
        const result = analyzeUrl(url);
        if (result.score >= SCAM_THRESHOLD) {
          blocks.push({ url, reason: 'Potential scam link detected', reasons: result.reasons });
        }
      }
    }
    // mode 'blacklist': handled entirely by the blacklist check above
  }

  // Obfuscated links are always blocked (except in blacklist-only mode)
  if (obfuscated.length > 0 && mode !== 'blacklist') {
    for (const ob of obfuscated) {
      blocks.push({ url: ob, reason: 'Obfuscated link detected', reasons: ['Link hidden with spaces / brackets'] });
    }
  }

  // Scam attempt: scam language + a non-trusted link (catches "scam trying")
  if (blocks.length === 0 && mode === 'scam' && config.scamDetection !== false) {
    if (hasScamText(message.content || '') && urls.length > 0) {
      const untrusted = urls.find(u => {
        const d = extractDomain(u);
        return !isTrustedDomain(d) && !isAllowedDomain(d, u, config);
      });
      if (untrusted) {
        blocks.push({
          url: untrusted,
          reason: 'Scam language used with an untrusted link',
          reasons: ['Suspicious scam phrasing next to a link'],
        });
      }
    }
  }

  if (blocks.length === 0) return;

  // Prevent other modules from double-processing this message
  if (!tryMarkHandled(message)) return;

  // Track violations and escalate repeat offenders
  const tracker = getTrackerEntry(linkTracker, `${message.guild.id}_${message.author.id}`, { violations: [] });
  cleanOldViolations(tracker);
  tracker.violations.push(Date.now());
  const action = computeAction(config.action || 'delete', tracker.violations);

  const uniqueUrls = [...new Set(blocks.map(b => b.url))];
  const detectedPatterns = [...new Set(blocks.flatMap(b => b.reasons))];
  const reason = blocks[0].reason;
  const highSeverity = action !== 'delete' && action !== 'warn';

  const logEmbed = buildModerationEmbed(client, message, {
    title: '🔗 Link Blocked',
    reason, action, moduleName: 'Anti-Link',
    urls: uniqueUrls, content: message.content,
    detectedPatterns,
    severity: highSeverity ? 'high' : 'low',
  });
  await sendLogEmbed(message.guild, config.logChannel, logEmbed);

  await executeAction(client, message, action, reason, 'Anti-Link');

  await sendModerationEmbed(client, message, {
    title: '🔗 Link Blocked',
    reason, action, moduleName: 'Anti-Link',
    urls: uniqueUrls,
    autoDelete: 5000,
    severity: highSeverity ? 'high' : 'low',
  });
};

/** Reset the violation tracker for a user */
function clearLinkTracker(guildId, userId) {
  linkTracker.delete(`${guildId}_${userId}`);
}

module.exports = checkMsg;
module.exports.clearLinkTracker = clearLinkTracker;
