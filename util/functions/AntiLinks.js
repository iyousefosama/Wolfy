const UserSchema = require('../../schema/Infraction-Schema')
const InfFunction = require('./Infraction')
const { PermissionsBitField, EmbedBuilder } = require('discord.js')

// Known scam domains and patterns
const SCAM_DOMAINS = [
  'steamcommunitty.com', 'strearncommunitry.com', 'stearncommunity.com',
  'discord-gift.com', 'discordnitro.com', 'free-discord-nitro.com',
  'fortnite-itemshop.com', 'freefortnite.com', 'v-bucks-generator.com',
  'robux-generator.com', 'freerobux.com', 'roblox-itemshop.com',
  'steam-gift.com', 'freesteamgames.com', 'steamwallet.com',
  'google-play-gift.com', 'itunes-gift.com', 'amazon-gift.com',
  'bitcoingenerator.com', 'freebitcoin.com', 'ethereum-generator.com'
];

const SCAM_PATTERNS = [
  /free\s*(nitro|robux|v-bucks|steam|gift|bitcoin|ethereum)/i,
  /generator/i,
  /claim\s*your\s*(reward|gift|prize)/i,
  /verify\s*your\s*account/i,
  /steam\s*community/i,
  /discord\s*gift/i
];

/**
 * Extract URLs from message content
 */
function extractUrls(content) {
  const urlRegex = /(https?:\/\/[^\s]+)|(discord\.gg\/[^\s]+)/gi;
  return content.match(urlRegex) || [];
}

/**
 * Extract domain from URL
 */
function extractDomain(url) {
  try {
    if (url.includes('discord.gg/')) return 'discord.gg';
    const hostname = new URL(url).hostname;
   return hostname.replace('www.', '');
  } catch {
    return null;
  }
}

/**
 * Check if URL is a known scam
 */
function isScamUrl(url) {
  const domain = extractDomain(url);
  if (!domain) return false;
  
  // Check against known scam domains
  if (SCAM_DOMAINS.some(scamDomain => domain.includes(scamDomain))) {
    return true;
  }
  
  // Check against scam patterns in URL
  return SCAM_PATTERNS.some(pattern => pattern.test(url));
}

/**
 * @param {import('../../struct/Client')} client
 * @param {import('discord.js').Message} message
 * @param {Object | null} guildData
 */
const checkMsg = async (client, message, guildData = null) => {
  if (!message) {
    return;
  }

  if (message.author == client.user) return;
  if (message.author.bot) {
    return;
  }
  if (!message.guild) {
    return;
  }

  let resolvedGuildData = guildData;

  try {
    if (!resolvedGuildData) {
      resolvedGuildData = await client.getCachedGuildData(message.guild.id);
    }
  } catch (err) {
    console.log(err)
    return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`)
  }

  if (message.author.id === message.guild.ownerId) {
    return;
  } else if (message.channel?.permissionsFor(message.member).has(PermissionsBitField.Flags.Administrator)) {
    return;
  } else if (!resolvedGuildData?.Mod?.AntiLink?.isEnabled) {
    return;
  }

  const antiLinkConfig = resolvedGuildData.Mod.AntiLink;
  const urls = extractUrls(message.content);
  
  if (urls.length === 0) return;

  let shouldBlock = false;
  let reason = '';
  let blockedUrls = [];

  for (const url of urls) {
    const domain = extractDomain(url);
    const domainLower = domain ? domain.toLowerCase() : '';
    const urlLower = url.toLowerCase();
    
    // Check whitelist first
    if (antiLinkConfig.whitelist && antiLinkConfig.whitelist.length > 0) {
      const isWhitelisted = antiLinkConfig.whitelist.some(allowed => {
        const allowedLower = allowed.toLowerCase();
        return domainLower.includes(allowedLower) || urlLower.includes(allowedLower);
      });
      if (isWhitelisted) continue;
    }
    
    // Check blacklist
    if (antiLinkConfig.blacklist && antiLinkConfig.blacklist.length > 0) {
      const isBlacklisted = antiLinkConfig.blacklist.some(blocked => {
        const blockedLower = blocked.toLowerCase();
        return domainLower.includes(blockedLower) || urlLower.includes(blockedLower);
      });
      if (isBlacklisted) {
        shouldBlock = true;
        reason = 'Blacklisted link detected';
        blockedUrls.push(url);
        continue;
      }
    }
    
    // Check allowed domains
    if (antiLinkConfig.allowedDomains && antiLinkConfig.allowedDomains.length > 0) {
      const isAllowed = antiLinkConfig.allowedDomains.some(allowed => {
        const allowedLower = allowed.toLowerCase();
        return domainLower.includes(allowedLower) || urlLower.includes(allowedLower);
      });
      if (!isAllowed) {
        shouldBlock = true;
        reason = 'Link not in allowed domains';
        blockedUrls.push(url);
        continue;
      }
    } else if (!antiLinkConfig.blacklist || antiLinkConfig.blacklist.length === 0) {
      // If neither allowedDomains nor blacklist is set, block any non-whitelisted link when AntiLink is enabled
      shouldBlock = true;
      reason = 'Links are disabled in this server';
      blockedUrls.push(url);
      continue;
    }
    
    // Scam detection
    if (antiLinkConfig.scamDetection && isScamUrl(url)) {
      shouldBlock = true;
      reason = 'Potential scam link detected';
      blockedUrls.push(url);
    }
  }

  if (shouldBlock && blockedUrls.length > 0) {
    const action = antiLinkConfig.action || 'delete';
    
    // Log to channel if configured
    if (antiLinkConfig.logChannel) {
      const logChannel = message.guild.channels.cache.get(antiLinkConfig.logChannel);
      if (logChannel) {
        const logEmbed = new EmbedBuilder()
          .setColor('#ff0000')
          .setTitle('🔗 Link Blocked')
          .addFields(
            { name: 'User', value: `${message.author.tag} (${message.author.id})`, inline: true },
            { name: 'Channel', value: `<#${message.channel.id}>`, inline: true },
            { name: 'Reason', value: reason, inline: true },
            { name: 'Blocked URLs', value: blockedUrls.slice(0, 5).join('\n'), inline: false },
            { name: 'Action', value: action, inline: true }
          )
          .setTimestamp();
        logChannel.send({ embeds: [logEmbed] }).catch(() => {});
      }
    }
    
    message.delete().then(() => {
      setTimeout(async () => {
        // Perform action based on configuration
        if (action === 'mute') {
          if (message.member?.moderatable) {
            await message.member.timeout(600000, 'Anti-Link: Blocked link').catch(async () => {
              const muteRole = message.guild.roles.cache.find(role => role.name === 'Muted');
              if (muteRole) {
                await message.member.roles.add(muteRole, 'Anti-Link: Blocked link').catch(() => {});
              }
            });
          }
        } else if (action === 'ban') {
          if (message.member?.bannable) {
            await message.member.ban({ reason: 'Anti-Link: Blocked scam/malicious link' }).catch(() => {});
          }
        }
        
        // Send infraction if enabled
        if (resolvedGuildData.Mod?.Infraction?.isEnabled) {
          InfFunction.Infraction(client, message);
        } else {
          return message.channel?.send({ 
            content: `🚫 ${message.author}, ${reason}!` 
          }).then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000)).catch(() => {});
        }
      }, 100);
    }).catch(() => {});
  }
};

module.exports = checkMsg;
