const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require('discord.js');
const { PROTECTOR_CONFIG } = require('../../util/functions/moderationDashboard');
const { ErrorEmbed } = require('../../util/modules/embeds');

/**
 * mod_configure — Button handler
 *
 * Opens a configuration modal for the selected protector type.
 * The button customId encodes the type: `mod_configure_<type>`.
 * ComponentsListener splits on "_" → parts = ["mod","configure",<type>].
 *
 * NOTE: Discord modals only accept TextInput (type 4) components, so every
 * field is a text input with a descriptive placeholder. Max 5 rows.
 *
 * @type {import("../../util/types/baseComponent")}
 */
module.exports = {
  name: 'mod_configure',
  enabled: true,

  async action(client, interaction, parts) {
    const type = parts?.[2];

    if (!type || !PROTECTOR_CONFIG[type]) {
      return interaction.reply({
        embeds: [ErrorEmbed('❌ Could not determine which protection module to configure.')],
        flags: ['Ephemeral'],
      });
    }

    const guildData = await client.getCachedGuildData(interaction.guildId).catch(() => null);
    const cfg = PROTECTOR_CONFIG[type];
    const node = guildData?.Mod?.[cfg.key] ?? {};

    const rows = [];

    if (type === 'antibot') {
      rows.push(
        row(buildTextInput('action', 'Action (mute / kick / ban)', node.action ?? 'mute')),
        row(buildNumberInput('max_messages', 'Max messages per minute (1-100)', node.maxMessagesPerMinute ?? 10)),
        row(buildNumberInput('max_same_links', 'Max same links before detection (1-20)', node.maxSameLinks ?? 3)),
        row(buildNumberInput('min_account_age', 'Min account age in hours (1-720)', Math.round((node.minAccountAge ?? 86400000) / 3600000))),
        row(buildTextInput('log_channel', 'Log channel ID (optional)', node.logChannel ?? '')),
      );
    } else if (type === 'antilink') {
      rows.push(
        row(buildTextInput('mode', 'Mode (scam / strict / whitelist / blacklist)', node.mode ?? 'scam')),
        row(buildTextInput('action', 'Action (delete / warn / mute / kick / ban)', node.action ?? 'delete')),
        row(buildTextInput('whitelist', 'Always-allowed domains (comma-separated)', Array.isArray(node.whitelist) ? node.whitelist.join(', ') : '', TextInputStyle.Paragraph)),
        row(buildTextInput('blacklist', 'Always-blocked domains (comma-separated)', Array.isArray(node.blacklist) ? node.blacklist.join(', ') : '', TextInputStyle.Paragraph)),
        row(buildTextInput('log_channel', 'Log channel ID (optional)', node.logChannel ?? '')),
      );
    } else if (type === 'antispam') {
      rows.push(
        row(buildTextInput('action', 'Action (delete / warn / mute / kick)', node.action ?? 'delete')),
        row(buildNumberInput('max_messages', 'Max messages per minute (1-100)', node.maxMessagesPerMinute ?? 10)),
        row(buildNumberInput('max_caps_percent', 'Max caps percentage (10-100)', node.maxCapsPercentage ?? 70)),
        row(buildNumberInput('max_duplicates', 'Max duplicate messages (1-20)', node.maxDuplicates ?? 3)),
        row(buildTextInput('log_channel', 'Log channel ID (optional)', node.logChannel ?? '')),
      );
    } else if (type === 'antiraid') {
      rows.push(
        row(buildTextInput('action', 'Action (mute / kick / ban)', node.action ?? 'mute')),
        row(buildNumberInput('max_joins', 'Max joins per minute (1-50)', node.maxJoinsPerMinute ?? 5)),
        row(buildNumberInput('min_account_age_hours', 'Min account age in hours (1-720)', Math.round((node.minAccountAge ?? 86400000) / 3600000))),
        row(buildNumberInput('lockdown_duration', 'Lockdown duration in seconds (60-3600)', Math.round((node.lockdownDuration ?? 300000) / 1000))),
        row(buildTextInput('log_channel', 'Log channel ID (optional)', node.logChannel ?? '')),
      );
    } else if (type === 'badwords') {
      rows.push(
        row(buildTextInput('words', 'Blocked words (comma-separated)', Array.isArray(node.BDW) ? node.BDW.join(', ') : '', TextInputStyle.Paragraph)),
        row(buildTextInput('action', 'Action (delete / warn / mute)', node.action ?? 'delete')),
        row(buildTextInput('log_channel', 'Log channel ID (optional)', node.logChannel ?? '')),
      );
    } else if (type === 'honeypot') {
      rows.push(
        row(buildTextInput('channel', 'Honey pot channel ID', node.channel ?? '')),
        row(buildTextInput('action', 'Action (kick / ban)', node.action ?? 'kick')),
        row(buildTextInput('log_channel', 'Log channel ID (optional)', node.logChannel ?? '')),
      );
    }

    const modal = new ModalBuilder()
      .setCustomId(`mod_modal_${type}`)
      .setTitle(`${cfg.emoji} Configure ${cfg.label}`);

    for (const r of rows) {
      modal.addComponents(r);
    }

    await interaction.showModal(modal);
  },
};

/** Wrap one or more components into a single ActionRow */
function row(components) {
  const r = new ActionRowBuilder();
  for (const c of [].concat(components)) r.addComponents(c);
  return r;
}

/**
 * @param {string} customId
 * @param {string} label
 * @param {number} value
 * @returns {TextInputBuilder}
 */
function buildNumberInput(customId, label, value) {
  return new TextInputBuilder()
    .setCustomId(customId)
    .setLabel(label.slice(0, 45))
    .setStyle(TextInputStyle.Short)
    .setPlaceholder(label.slice(0, 100))
    .setValue(String(value ?? ''))
    .setRequired(false);
}

/**
 * @param {string} customId
 * @param {string} label
 * @param {string} value
 * @param {import('discord.js').TextInputStyle} style
 * @returns {TextInputBuilder}
 */
function buildTextInput(customId, label, value, style = TextInputStyle.Short) {
  const input = new TextInputBuilder()
    .setCustomId(customId)
    .setLabel(label.slice(0, 45))
    .setStyle(style)
    .setPlaceholder(label.slice(0, 100))
    .setRequired(false);

  if (value !== undefined && value !== null && value !== '') {
    input.setValue(String(value));
  }

  return input;
}
