const { EmbedBuilder } = require('discord.js');
const { colors } = require('../constants/constants');

/**
 * Build a unified, beautiful moderation embed for all automated moderation events.
 * @param {import('../../struct/Client')} client
 * @param {import('discord.js').Message} message
 * @param {Object} options
 * @param {string} options.title - Embed title (e.g. "🔗 Link Blocked")
 * @param {string} options.reason - Moderation reason
 * @param {string} options.action - Applied action
 * @param {string} options.moduleName - Source module (Anti-Link, Anti-Spam, etc.)
 * @param {string} [options.severity] - 'high' | 'medium' | 'low' (overrides color)
 * @param {string} [options.color] - Hex color override (defaults by severity)
 * @param {string[]} [options.urls] - Blocked URLs to show
 * @param {string} [options.content] - Blocked message content to show
 * @param {string[]} [options.detectedPatterns] - Additional detection details
 * @returns {EmbedBuilder}
 */
function buildModerationEmbed(client, message, options) {
  const { title, reason, action, moduleName, urls, content, detectedPatterns } = options;

  // Color by action severity
  const colorMap = {
    ban: '#e74c3c',
    kick: '#e67e22',
    mute: '#f39c12',
    delete: '#e74c3c',
    warn: '#f1c40f',
  };
  const severityMap = { high: '#e74c3c', medium: '#e67e22', low: '#f1c40f' };
  const color = options.color
    || severityMap[options.severity]
    || colorMap[action?.toLowerCase()]
    || colors.MODERATION;

  const authorIcon = message.author.displayAvatarURL?.({ dynamic: true, size: 2048 });
  const botIcon = client.user?.displayAvatarURL?.();

  const embed = new EmbedBuilder()
    .setAuthor({
      name: message.author.tag,
      iconURL: authorIcon || undefined,
    })
    .setTitle(title || '🛡️ Moderation Action')
    .setColor(color)
    .setDescription(reason || 'Automated moderation action')
    .setTimestamp();

  embed.addFields(
    { name: '👤 User', value: `${message.author} (\`${message.author.id}\`)`, inline: true },
    { name: '📁 Channel', value: `<#${message.channel.id}>`, inline: true },
    { name: '⚡ Action', value: `\`${action || 'delete'}\``, inline: true },
  );

  if (urls && urls.length > 0) {
    embed.addFields({
      name: '🔗 Blocked URL' + (urls.length > 1 ? 's' : ''),
      value: urls.slice(0, 5).map(u => `\`${u.replace(/`/g, '')}\``).join('\n') || 'N/A',
      inline: false,
    });
  }

  if (content) {
    const preview = content.length > 500 ? content.slice(0, 497) + '...' : content;
    embed.addFields({
      name: '💬 Message Content',
      value: `\`\`\`${preview.replace(/`/g, '')}\`\`\``,
      inline: false,
    });
  }

  if (detectedPatterns && detectedPatterns.length > 0) {
    embed.addFields({
      name: '🧠 Detection Details',
      value: detectedPatterns.slice(0, 5).map(p => `• ${p}`).join('\n') || 'N/A',
      inline: false,
    });
  }

  embed.addFields({
    name: '🛡️ Module',
    value: moduleName || 'AutoModeration',
    inline: true,
  });

  embed.setFooter({
    text: `Wolfy AutoModeration • ${client.user?.username || 'Wolfy'}`,
    iconURL: botIcon || undefined,
  });

  return embed;
}

/**
 * Build a consistent "manual moderation action" embed for slash commands.
 * Author = the target member, footer = the moderator who ran the command.
 *
 * @param {object} params
 * @param {import('discord.js').GuildMember} params.target - member the action was applied to
 * @param {import('discord.js').User} params.executor - user who ran the command
 * @param {string} params.description - success/result description
 * @param {string} [params.color] - embed color (defaults to colors.ADMIN)
 * @returns {EmbedBuilder}
 */
function buildActionEmbed({ target, executor, description, color = colors.ADMIN }) {
  return new EmbedBuilder()
    .setColor(color)
    .setAuthor({
      name: target.user.username,
      iconURL: target.user.displayAvatarURL({ dynamic: true, size: 2048 }),
    })
    .setDescription(description)
    .setFooter({
      text: executor.username,
      iconURL: executor.displayAvatarURL({ dynamic: true, size: 2048 }),
    })
    .setTimestamp();
}

module.exports = { buildModerationEmbed, buildActionEmbed };
