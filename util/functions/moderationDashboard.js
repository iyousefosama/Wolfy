'use strict';

const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
} = require('discord.js');
const { BaseEmbed } = require('../modules/embeds');
const { colors } = require('../constants/constants');

/**
 * Protector registry — describes every automation moderation module that the
 * unified /moderation dashboard manages.
 *
 * Each entry defines:
 *   - key         : schema path under `guildData.Mod.<key>`
 *   - label       : human-readable name shown in dropdowns / buttons
 *   - emoji       : prefix icon
 *   - toggleField : boolean field name inside the schema node that controls enabled/disabled
 *   - fields      : array of { name, path, formatter, type } describing display rows
 */
const PROTECTOR_CONFIG = {
  antibot: {
    key: 'AntiBot',
    label: 'Anti-Bot',
    emoji: '🤖',
    toggleField: 'isEnabled',
    iconUrl: null,
    short: 'Detect compromised / bot-like accounts',
    fields: [
      { name: 'Max Messages/Min', path: 'maxMessagesPerMinute', formatter: (v) => String(v ?? 10) },
      { name: 'Max Same Links', path: 'maxSameLinks', formatter: (v) => String(v ?? 3) },
      { name: 'Min Account Age', path: 'minAccountAge', formatter: (v) => `${Math.round((v ?? 86400000) / 3600000)}h` },
      { name: 'Require Verified', path: 'requireVerified', formatter: (v) => (v ? '✅ Yes' : '❌ No') },
      { name: 'Action', path: 'action', formatter: (v) => `\`${v ?? 'mute'}\`` },
      { name: 'Log Channel', path: 'logChannel', formatter: (v) => (v ? `<#${v}>` : '_Not set_'), inline: false },
      { name: 'Suspicious Patterns', path: 'suspiciousPatterns', formatter: (v) => Array.isArray(v) ? v.join(', ') || 'None' : 'None', inline: false },
      { name: 'Bypass Roles', path: 'bypassRoles', formatter: (v) => Array.isArray(v) && v.length ? v.map(r => `<@&${r}>`).join(', ') : 'None', inline: false },
    ],
  },
  antilink: {
    key: 'AntiLink',
    label: 'Anti-Link',
    emoji: '🔗',
    toggleField: 'isEnabled',
    short: 'Block scam / blacklisted / non-whitelisted links',
    fields: [
      { name: 'Mode', path: 'mode', formatter: (v) => `\`${v ?? 'scam'}\`` },
      { name: 'Action', path: 'action', formatter: (v) => `\`${v ?? 'delete'}\`` },
      { name: 'Scam Detection', path: 'scamDetection', formatter: (v) => (v ? '✅ Enabled' : '❌ Disabled') },
      { name: 'Log Channel', path: 'logChannel', formatter: (v) => (v ? `<#${v}>` : '_Not set_'), inline: false },
      { name: 'Whitelisted Domains', path: 'whitelist', formatter: (v) => Array.isArray(v) && v.length ? v.join(', ') : 'None', inline: false },
      { name: 'Blacklisted Domains', path: 'blacklist', formatter: (v) => Array.isArray(v) && v.length ? v.join(', ') : 'None', inline: false },
      { name: 'Allowed Domains', path: 'allowedDomains', formatter: (v) => Array.isArray(v) && v.length ? v.join(', ') : 'None', inline: false },
      { name: 'Bypass Roles', path: 'bypassRoles', formatter: (v) => Array.isArray(v) && v.length ? v.map(r => `<@&${r}>`).join(', ') : 'None', inline: false },
      { name: 'Bypass Channels', path: 'bypassChannels', formatter: (v) => Array.isArray(v) && v.length ? v.map(c => `<#${c}>`).join(', ') : 'None', inline: false },
    ],
  },
  antispam: {
    key: 'AntiSpam',
    label: 'Anti-Spam',
    emoji: '⚠️',
    toggleField: 'isEnabled',
    short: 'Detect rate, caps, emoji, mention & duplicate spam',
    fields: [
      { name: 'Max Messages/Min', path: 'maxMessagesPerMinute', formatter: (v) => String(v ?? 10) },
      { name: 'Max Caps %', path: 'maxCapsPercentage', formatter: (v) => `${v ?? 70}%` },
      { name: 'Min Caps Length', path: 'minCapsLength', formatter: (v) => String(v ?? 5) },
      { name: 'Max Emojis', path: 'maxEmojis', formatter: (v) => String(v ?? 10) },
      { name: 'Max Duplicates', path: 'maxDuplicates', formatter: (v) => String(v ?? 3) },
      { name: 'Max Mentions', path: 'maxMentions', formatter: (v) => String(v ?? 5) },
      { name: 'Max Links/Message', path: 'maxLinksPerMessage', formatter: (v) => String(v ?? 3) },
      { name: 'Action', path: 'action', formatter: (v) => `\`${v ?? 'delete'}\`` },
      { name: 'Log Channel', path: 'logChannel', formatter: (v) => (v ? `<#${v}>` : '_Not set_'), inline: false },
      { name: 'Bypass Roles', path: 'bypassRoles', formatter: (v) => Array.isArray(v) && v.length ? v.map(r => `<@&${r}>`).join(', ') : 'None', inline: false },
      { name: 'Bypass Channels', path: 'bypassChannels', formatter: (v) => Array.isArray(v) && v.length ? v.map(c => `<#${c}>`).join(', ') : 'None', inline: false },
    ],
  },
  antiraid: {
    key: 'AntiRaid',
    label: 'Anti-Raid',
    emoji: '🛡️',
    toggleField: 'isEnabled',
    short: 'Detect join raids & mass-account joins',
    fields: [
      { name: 'Max Joins/Min', path: 'maxJoinsPerMinute', formatter: (v) => String(v ?? 5) },
      { name: 'Min Account Age', path: 'minAccountAge', formatter: (v) => `${Math.round((v ?? 86400000) / 3600000)}h` },
      { name: 'Lockdown Duration', path: 'lockdownDuration', formatter: (v) => `${Math.round((v ?? 300000) / 1000)}s` },
      { name: 'Action', path: 'action', formatter: (v) => `\`${v ?? 'mute'}\`` },
      { name: 'Log Channel', path: 'logChannel', formatter: (v) => (v ? `<#${v}>` : '_Not set_'), inline: false },
    ],
  },
  badwords: {
    key: 'BadWordsFilter',
    label: 'Bad Words',
    emoji: '🚫',
    toggleField: 'isEnabled',
    short: 'Block custom blacklisted words',
    fields: [
      { name: 'Blocked Words', path: 'BDW', formatter: (v) => Array.isArray(v) && v.length ? v.join(', ') : 'None', inline: false },
      { name: 'Action', path: 'action', formatter: (v) => `\`${v ?? 'delete'}\`` },
      { name: 'Log Channel', path: 'logChannel', formatter: (v) => (v ? `<#${v}>` : '_Not set_'), inline: false },
      { name: 'Bypass Roles', path: 'bypassRoles', formatter: (v) => Array.isArray(v) && v.length ? v.map(r => `<@&${r}>`).join(', ') : 'None', inline: false },
      { name: 'Bypass Channels', path: 'bypassChannels', formatter: (v) => Array.isArray(v) && v.length ? v.map(c => `<#${c}>`).join(', ') : 'None', inline: false },
    ],
  },
  honeypot: {
    key: 'HoneyPot',
    label: 'Honey Pot',
    emoji: '🍯',
    toggleField: 'isEnabled',
    short: 'Trap channel that kicks scam accounts',
    fields: [
      { name: 'Channel', path: 'channel', formatter: (v) => (v ? `<#${v}>` : '_Not set_'), inline: false },
      { name: 'Action', path: 'action', formatter: (v) => `\`${v ?? 'kick'}\`` },
      { name: 'Log Channel', path: 'logChannel', formatter: (v) => (v ? `<#${v}>` : '_Not set_'), inline: false },
    ],
  },
};

const PROTLECT_ORDER = ['antibot', 'antilink', 'antispam', 'antiraid', 'badwords', 'honeypot'];

/** @typedef {{ name: string, value: string }} SelectOption */

/**
 * Build the select-menu options for the "choose a protector" dropdown.
 * @returns {SelectOption[]}
 */
function buildSelectOptions() {
  return PROTLECT_ORDER.map((key) => {
    const cfg = PROTECTOR_CONFIG[key];
    return { label: cfg.label, value: key, description: cfg.short, emoji: cfg.emoji };
  });
}

/**
 * Safely retrieve a nested value from an object via dot-path.
 * @param {Object} obj
 * @param {string} path
 * @returns {*}
 */
function getPath(obj, path) {
  if (!obj) return undefined;
  return path.split('.').reduce((acc, seg) => (acc == null ? acc : acc[seg]), obj);
}

/**
 * Build an embed summarising a single protector's current settings.
 * @param {import('../../struct/Client')} client
 * @param {Object|null} guildData
 * @param {string} type  — one of the PROTECTOR_CONFIG keys
 * @param {Object} [opts]
 * @param {string} [opts.title]  override title
 * @returns {EmbedBuilder}
 */
function buildProtectorEmbed(client, guildData, type, opts = {}) {
  const cfg = PROTECTOR_CONFIG[type];
  const node = guildData?.Mod?.[cfg.key] ?? {};
  const isEnabled = !!node[cfg.toggleField];

  const title = opts.title ?? `${cfg.emoji} ${cfg.label} — ${isEnabled ? 'Enabled' : 'Disabled'}`;

  const embed = BaseEmbed()
    .setAuthor({ name: client.user?.username ?? 'Wolfy', iconURL: client.user?.displayAvatarURL() })
    .setTitle(title)
    .setColor(isEnabled ? colors.SUCCESS : colors.ERROR)
    .setThumbnail(client.user?.displayAvatarURL())
    .setFooter({ text: `Type: /moderation • Requested by` })
    .setTimestamp();

  if (opts.footerUser) {
    embed.setFooter({ text: `Wolfy Moderation • ${opts.footerUser.username}`, iconURL: opts.footerUser.displayAvatarURL?.() });
  }

  for (const f of cfg.fields) {
    const raw = getPath(node, f.path);
    embed.addFields({
      name: f.name,
      value: f.formatter(raw),
      inline: f.inline ?? true,
    });
  }

  embed.addFields({ name: '\u200b', value: '\u200b' });
  return embed;
}

/**
 * Build the main dashboard embed showing the on/off state of every protector.
 * @param {import('../../struct/Client')} client
 * @param {Object|null} guildData
 * @returns {EmbedBuilder}
 */
function buildDashboardEmbed(client, guildData = {}) {
  const embed = BaseEmbed()
    .setAuthor({ name: client.user?.username ?? 'Wolfy', iconURL: client.user?.displayAvatarURL() })
    .setTitle('🛡️ Server Moderation Dashboard')
    .setDescription('Configure all automated moderation systems in one place.')
    .setColor(colors.MODERATION);

  for (const key of PROTLECT_ORDER) {
    const cfg = PROTECTOR_CONFIG[key];
    const node = guildData?.Mod?.[cfg.key] ?? {};
    const enabled = !!node[cfg.toggleField];
    embed.addFields({
      name: `${cfg.emoji} ${cfg.label}`,
      value: `${cfg.short} — **${enabled ? '✅ Enabled' : '❌ Disabled'}**`,
      inline: false,
    });
  }

  return embed;
}

/**
 * Build a comprehensive "view all settings" embed covering every protector.
 * @param {import('../../struct/Client')} client
 * @param {Object|null} guildData
 * @returns {EmbedBuilder}
 */
function buildFullSummaryEmbed(client, guildData = {}) {
  const embed = BaseEmbed()
    .setAuthor({ name: client.user?.username ?? 'Wolfy', iconURL: client.user?.displayAvatarURL() })
    .setTitle('📊 All Moderation Settings')
    .setColor(colors.MODERATION);

  for (const key of PROTLECT_ORDER) {
    const cfg = PROTECTOR_CONFIG[key];
    const node = guildData?.Mod?.[cfg.key] ?? {};
    const enabled = !!node[cfg.toggleField];

    let detail = `Status: **${enabled ? '✅ Enabled' : '❌ Disabled'}**\n`;
    for (const f of cfg.fields) {
      detail += `· **${f.name}:** ${f.formatter(getPath(node, f.path))}\n`;
    }

    embed.addFields({
      name: `${cfg.emoji} ${cfg.label}`,
      value: detail,
      inline: false,
    });
  }

  return embed;
}

/**
 * Build the primary action button row for the dashboard.
 * @returns {ActionRowBuilder}
 */
function buildDashboardButtons() {
  const row = new ActionRowBuilder();
  row.addComponents(
    new ButtonBuilder()
      .setCustomId('mod_view')
      .setLabel('View All Settings')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('📊'),
    new ButtonBuilder()
      .setCustomId('mod_choose')
      .setLabel('Configure')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('⚙️'),
    new ButtonBuilder()
      .setCustomId('mod_reset')
      .setLabel('Reset All')
      .setStyle(ButtonStyle.Danger)
      .setEmoji('🔄'),
  );
  return row;
}

/**
 * Build the configure / toggle button row shown beneath a protector detail embed.
 * @param {string} type
 * @returns {ActionRowBuilder}
 */
function buildProtectorButtons(type) {
  const row = new ActionRowBuilder();
  row.addComponents(
    new ButtonBuilder()
      .setCustomId(`mod_configure_${type}`)
      .setLabel('Edit Settings')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('✏️'),
    new ButtonBuilder()
      .setCustomId(`mod_toggle_${type}`)
      .setLabel('Toggle On/Off')
      .setStyle(ButtonStyle.Success)
      .setEmoji('🔁'),
  );
  return row;
}

/**
 * Build the select menu used to pick which protector to configure.
 * @returns {ActionRowBuilder}
 */
function buildProtectorSelectMenu() {
  const select = new StringSelectMenuBuilder()
    .setCustomId('mod_select')
    .setPlaceholder('Choose a moderation module to configure...')
    .addOptions(buildSelectOptions());

  const row = new ActionRowBuilder().addComponents(select);
  return row;
}

/**
 * Build the confirmation button row for destructive actions (e.g. reset all).
 * @returns {ActionRowBuilder}
 */
function buildConfirmButtons() {
  const row = new ActionRowBuilder();
  row.addComponents(
    new ButtonBuilder()
      .setCustomId('mod_confirm_reset')
      .setLabel('Yes, reset everything')
      .setStyle(ButtonStyle.Danger)
      .setEmoji('⚠️'),
    new ButtonBuilder()
      .setCustomId('mod_cancel_reset')
      .setLabel('Cancel')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('❌'),
  );
  return row;
}

module.exports = {
  PROTECTOR_CONFIG,
  PROTLECT_ORDER,
  buildSelectOptions,
  getPath,
  buildProtectorEmbed,
  buildDashboardEmbed,
  buildFullSummaryEmbed,
  buildDashboardButtons,
  buildProtectorButtons,
  buildProtectorSelectMenu,
  buildConfirmButtons,
};
