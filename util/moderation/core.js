const { PermissionsBitField } = require('discord.js');
const { buildModerationEmbed } = require('./embeds');

/** Messages already handled by a moderation module (prevent double-processing) */
const handledMessages = new WeakSet();

/** Try to claim a message for handling. Returns false if another module already claimed it. */
function tryMarkHandled(message) {
  if (!message || handledMessages.has(message)) return false;
  handledMessages.add(message);
  return true;
}

/** Is this message already claimed by a moderation module? */
function isHandled(message) {
  return !!message && handledMessages.has(message);
}

/** Extract URLs from a content string */
function extractUrls(content) {
  if (!content) return [];
  const urlRegex = /(?:https?:\/\/|www\.|discord\.(?:gg|com\/invite)\/)[^\s<>"')\]]+/gi;
  const matches = content.match(urlRegex) || [];
  return matches.map((u) => u.replace(/[.,;:!?'"]+$/, ''));
}

/** Extract URLs from a message, including file attachment URLs */
function extractMessageUrls(message) {
  const urls = extractUrls(message?.content || '');
  if (message?.attachments?.size) {
    for (const attachment of message.attachments.values()) {
      if (attachment.url) urls.push(attachment.url);
    }
  }
  return urls;
}

/** Extract domain from URL */
function extractDomain(url) {
  try {
    if (url.includes('discord.gg/')) return 'discord.gg';
    const clean = url.startsWith('www.') ? `https://${url}` : url;
    return new URL(clean).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    const m = url.match(/(?:https?:\/\/)?(?:www\.)?([a-z0-9-]+(?:\.[a-z0-9-]+)+)/i);
    return m ? m[1].toLowerCase() : null;
  }
}

/** Is user admin or guild owner */
function isAdminOrOwner(message) {
  if (!message.guild) return true;
  if (message.author.id === message.guild.ownerId) return true;
  return !!message.member?.permissions?.has(PermissionsBitField.Flags.Administrator);
}

/** Has bypass role */
function hasBypassRole(message, bypassRoles = []) {
  if (!bypassRoles?.length || !message.member) return false;
  return message.member.roles.cache.some(r => bypassRoles.includes(r.id));
}

/** Is channel bypassed */
function isBypassedChannel(message, bypassChannels = []) {
  return bypassChannels?.includes(message.channel.id) || false;
}

/** Get guild data safely */
async function getGuildData(client, guildId) {
  try { return await client.getCachedGuildData(guildId); } catch (e) { return null; }
}

/** Execute moderation action */
async function executeAction(client, message, action, reason, moduleName) {
  if (!message?.member) return false;
  const fullReason = `${moduleName}: ${reason}`;
  switch (action) {
    case 'delete': await message.delete().catch(() => {}); return true;
    case 'warn':
      await message.delete().catch(() => {});
      return true;
    case 'mute': {
      await message.delete().catch(() => {});
      let ok = false;
      if (message.member.moderatable) {
        await message.member.timeout(600000, fullReason).then(() => ok = true).catch(() => {});
      }
      if (!ok) {
        const muteRole = message.guild.roles.cache.find(r => r.name === 'Muted');
        if (muteRole) await message.member.roles.add(muteRole, fullReason).then(() => ok = true).catch(() => {});
      }
      return ok;
    }
    case 'kick':
      await message.delete().catch(() => {});
      if (message.member.kickable) { await message.member.kick(fullReason).catch(() => {}); return true; }
      return false;
    case 'ban':
      await message.delete().catch(() => {});
      if (message.member.bannable) { await message.member.ban({ reason: fullReason }).catch(() => {}); return true; }
      return false;
    default: await message.delete().catch(() => {}); return true;
  }
}

/** Send unified moderation embed */
async function sendModerationEmbed(client, message, options) {
  const embed = buildModerationEmbed(client, message, options);
  const sent = await message.channel.send({ embeds: [embed] }).catch(() => null);
  if (sent && options.autoDelete !== 0) {
    setTimeout(() => sent.delete().catch(() => {}), options.autoDelete ?? 5000);
  }
  return sent;
}

/** Send log embed to log channel */
async function sendLogEmbed(guild, logChannelId, embed) {
  if (!logChannelId) return null;
  const ch = guild.channels.cache.get(logChannelId);
  if (!ch) return null;
  return ch.send({ embeds: [embed] }).catch(() => null);
}

/** Create tracker map */
function createTracker() { return new Map(); }

/** Get tracker entry */
function getTrackerEntry(tracker, key, initial = {}) {
  if (!tracker.has(key)) tracker.set(key, { messages: [], ...initial });
  return tracker.get(key);
}

/** Clean old messages from tracker */
function cleanOldMessages(tracker, windowMs = 60000) {
  const cutoff = Date.now() - windowMs;
  if (Array.isArray(tracker.messages)) tracker.messages = tracker.messages.filter(m => m.timestamp > cutoff);
}

/** Is user exempt */
function isExempt(message, config = {}) {
  if (!message.guild) return true;
  if (message.author.id === message.guild.ownerId) return true;
  if (isAdminOrOwner(message)) return true;
  if (hasBypassRole(message, config.bypassRoles)) return true;
  if (isBypassedChannel(message, config.bypassChannels)) return true;
  return false;
}

/** Is URL an IP address */
function isIpAddress(url) {
  const m = url.match(/(?:https?:\/\/)?(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})(?::\d+)?/);
  if (!m) return false;
  return [m[1], m[2], m[3], m[4]].every(n => Number(n) >= 0 && Number(n) <= 255);
}

/** Detect obfuscated scam URLs (domain-like tokens only, never plain text) */
function detectObfuscatedUrls(content) {
  if (!content) return [];

  // Strip real URLs first so obfuscation only matches hidden / lookalike tokens
  const cleaned = content.replace(/(?:https?:\/\/|www\.|discord\.(?:gg|com\/invite)\/)\S+/gi, ' ');

  const found = [];
  const patterns = [
    /discord\s*[\[(]?\s*\.\s*[\])]?\s*gg/gi,
    /discord\s*[\[(]?\s*\.\s*[\])]?\s*(?:gift|nitro|community)/gi,
    /steam\s*[\[(]?\s*\.\s*[\])]?\s*community/gi,
    /discord(?:-|_|\s)gg(?:[^\w]|$)/gi,
    /discord(?:-|_|\s)(?:gift|nitro)(?:[^\w]|$)/gi,
    /(?:discord|steam)[\s]*[\[(]?[\s.]*[\])]?\s*gift/gi,
  ];
  for (const p of patterns) {
    const m = cleaned.match(p);
    if (m) found.push(m[0]);
  }
  return found;
}

/** Has zalgo text */
function hasZalgoText(content) {
  const chars = content.match(/[\u0300-\u036f\u0489]/g) || [];
  return chars.length > 5;
}

/** Check leetspeak word */
function containsLeetspeak(content, word) {
  const leet = { a: '[a@4]', b: '[b8]', e: '[e3]', g: '[g69]', i: '[i1!|]', l: '[l1|]', o: '[o0]', s: '[s5$]', t: '[t7]', z: '[z2]' };
  let pat = '';
  for (const c of word.toLowerCase()) pat += leet[c] || c;
  return new RegExp(`\\b${pat}\\b`, 'i').test(content);
}

/* ------------------------------------------------------------------ */
/* Scam URL analysis helpers                                           */
/* ------------------------------------------------------------------ */

const TRUSTED_BRANDS = [
  'discord', 'steam', 'steamcommunity', 'steampowered', 'roblox', 'paypal',
  'google', 'youtube', 'twitch', 'github', 'amazon', 'netflix', 'spotify',
  'apple', 'microsoft', 'xbox', 'playstation', 'epicgames', 'instagram',
  'twitter', 'facebook', 'tiktok', 'snapchat', 'whatsapp', 'telegram',
  'reddit', 'gmail', 'outlook',
];

const TRUSTED_DOMAINS = [
  'discord.com', 'discordapp.com', 'discord.gg', 'discord.media', 'discord.new',
  'steamcommunity.com', 'steampowered.com', 'steamstatic.com', 's.team',
  'roblox.com', 'paypal.com', 'google.com', 'youtube.com', 'youtu.be',
  'twitch.tv', 'github.com', 'gmail.com', 'amazon.com', 'netflix.com',
  'spotify.com', 'apple.com', 'microsoft.com', 'xbox.com', 'playstation.com',
  'epicgames.com', 'instagram.com', 'twitter.com', 'x.com', 'facebook.com',
  'tiktok.com', 'snapchat.com', 'whatsapp.com', 'telegram.org', 'reddit.com',
];

const URL_SHORTENERS = [
  'bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'is.gd', 'cutt.ly', 'shorturl.at',
  'rb.gy', 'ow.ly', 'buff.ly', 'rebrand.ly', 'snip.ly', 'tiny.cc', 's.id',
  'adf.ly', 'mega.nz', 'discord.me', 'dsc.gg', 'dcsc.link', 'invite.gg',
  'dis.gd', 'gg.gg', 'u.ga', 'kutt.it', 'short.gs',
];

const SCAM_PATH_KEYWORDS = [
  'free', 'nitro', 'gift', 'robux', 'vbuck', 'v-buck', 'steam', 'claim',
  'verify', 'giveaway', 'prize', 'reward', 'generator', 'login', 'password',
  'refund', 'payout', 'cashout', 'wallet', 'credential', 'offer', 'discount',
  'airdrop', 'mining', 'invest',
];

/** Is domain a trusted domain or subdomain of one */
function isTrustedDomain(domain) {
  if (!domain) return false;
  const d = domain.toLowerCase();
  return TRUSTED_DOMAINS.some((t) => d === t || d.endsWith(`.${t}`));
}

/** Levenshtein distance (early-exits when > 2) */
function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  if (Math.abs(m - n) > 2) return 3;
  const dp = [];
  for (let i = 0; i <= m; i++) {
    dp[i] = new Array(n + 1).fill(0);
    dp[i][0] = i;
  }
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
  }
  return dp[m][n];
}

/** Detect typosquatting / brand-impersonation domains */
function isTyposquat(domain) {
  if (!domain) return false;
  const d = domain.toLowerCase().replace(/^www\./, '');
  if (isTrustedDomain(d)) return false;

  const parts = d.split('.');
  const registrable = parts.length >= 2 ? parts[parts.length - 2] : d;
  const clean = registrable.replace(/[-_0-9]/g, '');
  if (clean.length < 4) return false;

  for (const brand of TRUSTED_BRANDS) {
    if (brand.length < 4) continue;
    if (levenshtein(clean, brand) <= 2) return true;
    if (clean.startsWith(brand) && clean.length - brand.length >= 2) return true;
    if (clean.endsWith(brand) && clean.length - brand.length >= 2) return true;
  }
  return false;
}

/** Suspicious subdomain impersonation (e.g. discord-gg.evil.com) */
const BRAND_SUBDOMAIN_KEYWORDS = ['discord', 'steam', 'steamcommunity', 'nitro', 'robux', 'vbuck', 'paypal', 'roblox', 'gg'];
const GENERIC_SUBDOMAIN_KEYWORDS = ['gift', 'free', 'claim', 'verify'];

/** Returns the suspicion weight (0 = none, 50 = generic, 90 = brand impersonation) */
function subdomainSuspicion(domain) {
  if (!domain) return 0;
  const d = domain.toLowerCase();
  if (isTrustedDomain(d)) return 0;
  const firstLabel = d.split('.')[0] || '';
  if (BRAND_SUBDOMAIN_KEYWORDS.some((s) => firstLabel.includes(s))) return 90;
  if (GENERIC_SUBDOMAIN_KEYWORDS.some((s) => firstLabel.includes(s))) return 50;
  return 0;
}

/** Is URL shortener domain */
function isUrlShortener(domain) {
  if (!domain) return false;
  const d = domain.toLowerCase();
  return URL_SHORTENERS.some((s) => d === s || d.endsWith(`.${s}`));
}

/** Is an obfuscated url (spaces / brackets around dots) */
function isObfuscatedUrl(url) {
  return /discord\s*[\[(]?\s*\.\s*[\])]?\s*gg/i.test(url)
    || /discord\s*[\[(]?\s*\.\s*[\])]?\s*(?:gift|nitro)/i.test(url)
    || /steam\s*[\[(]?\s*\.\s*[\])]?\s*community/i.test(url);
}

/** Strong scam phrasing in message text (only meaningful when a URL is present) */
const SCAM_TEXT_PATTERNS = [
  /(free|claim|get)\s*(nitro|robux|v-?bucks|steam|gift|bitcoin|ethereum|paypal)/i,
  /claim\s*(your|a|the)?\s*(reward|gift|prize|nitro|robux|v-?bucks)/i,
  /verify\s*(your)?\s*(account|discord|steam|identity)/i,
  /you\s*(have|are)\s*(won|selected|chosen)/i,
  /click\s*(here|this)?\s*(link|to\s*claim)/i,
  /discord\s*(nitro|gift)/i,
  /steam\s*(gift|offer|rep)/i,
  /limited\s*(time|offer)/i,
];

/** Does the message text look like strong scam language? */
function hasScamText(content) {
  if (!content) return false;
  return SCAM_TEXT_PATTERNS.some((p) => p.test(content));
}

/**
 * Analyze a single URL and return a scam score + reasons.
 * @param {string} url
 * @returns {{ score: number, reasons: string[] }}
 */
function analyzeUrl(url) {
  const domain = extractDomain(url);
  if (!domain) return { score: 0, reasons: [] };

  const reasons = [];
  let score = 0;
  const d = domain.toLowerCase();
  const lower = url.toLowerCase();

  // Direct IP links are almost always malicious
  if (isIpAddress(url)) {
    score += 100;
    reasons.push('Direct IP address link');
  }

  // URL-shortener used alongside scam phrasing
  if (isUrlShortener(d) && hasScamText(lower)) {
    score += 60;
    reasons.push(`Shortener \`${d}\` with scam language`);
  }

  // Known scam / brand-impersonating domain
  if (isTyposquat(d)) {
    score += 90;
    reasons.push(`Domain impersonates a known brand (\`${d}\`)`);
  }

  // Suspicious subdomain trick
  const subWeight = subdomainSuspicion(d);
  if (subWeight > 0) {
    score += subWeight;
    reasons.push(`Suspicious subdomain \`${d}\``);
  }

  // Scam keywords inside the path/query only
  const path = lower.split(/[?#]/)[0] || '';
  let pathHits = 0;
  for (const kw of SCAM_PATH_KEYWORDS) {
    if (path.includes(kw)) {
      pathHits += 1;
      if (pathHits >= 3) break;
    }
  }
  if (pathHits > 0) {
    score += Math.min(pathHits * 20, 40);
    reasons.push(`Suspicious path keywords (\`${pathHits}\`)`);
  }

  return { score, reasons };
}

module.exports = {
  extractUrls, extractMessageUrls, extractDomain, isAdminOrOwner, hasBypassRole,
  isBypassedChannel, getGuildData, executeAction, sendModerationEmbed, sendLogEmbed,
  createTracker, getTrackerEntry, cleanOldMessages, isExempt,
  isIpAddress, detectObfuscatedUrls, hasZalgoText, containsLeetspeak,
  tryMarkHandled, isHandled,
  isTrustedDomain, isTyposquat, isUrlShortener,
  isObfuscatedUrl, hasScamText, analyzeUrl, TRUSTED_DOMAINS,
};
