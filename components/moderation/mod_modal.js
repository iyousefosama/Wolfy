const GuildSchema = require('../../schema/GuildSchema');
const {
  PROTECTOR_CONFIG,
  buildProtectorEmbed,
  buildProtectorButtons,
} = require('../../util/functions/moderationDashboard');
const { setupHoneyPotChannel } = require('../../util/functions/HoneyPot');
const { SuccessEmbed, ErrorEmbed, WarningEmbed } = require('../../util/modules/embeds');

/**
 * mod_modal — Modal submit handler
 *
 * ComponentsListener routes modal submits via prefix matching:
 *   customId `mod_modal_<type>` → finds component registered as `mod_modal`.
 *
 * Text inputs are read via getTextInputValue, select menus via
 * getSelectMenuValues. Every value is validated before saving.
 *
 * @type {import("../../util/types/baseComponent")}
 */
module.exports = {
  name: 'mod_modal',
  enabled: true,

  async action(client, interaction) {
    await interaction.deferReply({ flags: ['Ephemeral'] }).catch(() => {});

    const customId = interaction.customId; // e.g. mod_modal_antilink
    const parts = customId.split('_');    // ["mod","modal",<type>]
    const type = parts[2];

    const cfg = PROTECTOR_CONFIG[type];
    if (!cfg || !customId.startsWith('mod_modal_')) {
      return interaction.editReply({
        embeds: [ErrorEmbed('❌ Invalid modal submission.')],
      });
    }

    const fields = interaction.fields;
    const errors = [];
    const updateData = {};

    if (type === 'antibot') {
      const actionVal = validateAction(readText(fields, 'action'), ['mute', 'kick', 'ban'], 'Action', errors);
      if (actionVal !== null) updateData['Mod.AntiBot.action'] = actionVal;

      const maxMessagesNum = validateNumber(readText(fields, 'max_messages'), 1, 100, 'Max messages per minute', errors);
      if (maxMessagesNum !== null) updateData['Mod.AntiBot.maxMessagesPerMinute'] = maxMessagesNum;

      const maxLinksNum = validateNumber(readText(fields, 'max_same_links'), 1, 20, 'Max same links', errors);
      if (maxLinksNum !== null) updateData['Mod.AntiBot.maxSameLinks'] = maxLinksNum;

      const minAgeNum = validateNumber(readText(fields, 'min_account_age'), 1, 720, 'Min account age (hours)', errors);
      if (minAgeNum !== null) updateData['Mod.AntiBot.minAccountAge'] = minAgeNum * 3600000;

      const channelId = await validateChannel(client, interaction, readText(fields, 'log_channel'), 'Log channel', errors);
      if (channelId !== null) updateData['Mod.AntiBot.logChannel'] = channelId;
    } else if (type === 'antilink') {
      const modeVal = validateAction(readText(fields, 'mode'), ['scam', 'strict', 'whitelist', 'blacklist'], 'Detection mode', errors);
      if (modeVal !== null) updateData['Mod.AntiLink.mode'] = modeVal;

      const actionVal = validateAction(readText(fields, 'action'), ['delete', 'warn', 'mute', 'kick', 'ban'], 'Action', errors);
      if (actionVal !== null) updateData['Mod.AntiLink.action'] = actionVal;

      const whitelist = parseDomains(readText(fields, 'whitelist'));
      if (whitelist !== null) updateData['Mod.AntiLink.whitelist'] = whitelist;

      const blacklist = parseDomains(readText(fields, 'blacklist'));
      if (blacklist !== null) updateData['Mod.AntiLink.blacklist'] = blacklist;

      const channelId = await validateChannel(client, interaction, readText(fields, 'log_channel'), 'Log channel', errors);
      if (channelId !== null) updateData['Mod.AntiLink.logChannel'] = channelId;
    } else if (type === 'antispam') {
      const actionVal = validateAction(readText(fields, 'action'), ['delete', 'warn', 'mute', 'kick'], 'Action', errors);
      if (actionVal !== null) updateData['Mod.AntiSpam.action'] = actionVal;

      const messagesNum = validateNumber(readText(fields, 'max_messages'), 1, 100, 'Max messages per minute', errors);
      if (messagesNum !== null) updateData['Mod.AntiSpam.maxMessagesPerMinute'] = messagesNum;

      const capsNum = validateNumber(readText(fields, 'max_caps_percent'), 10, 100, 'Max caps percentage', errors);
      if (capsNum !== null) updateData['Mod.AntiSpam.maxCapsPercentage'] = capsNum;

      const dupsNum = validateNumber(readText(fields, 'max_duplicates'), 1, 20, 'Max duplicates', errors);
      if (dupsNum !== null) updateData['Mod.AntiSpam.maxDuplicates'] = dupsNum;

      const channelId = await validateChannel(client, interaction, readText(fields, 'log_channel'), 'Log channel', errors);
      if (channelId !== null) updateData['Mod.AntiSpam.logChannel'] = channelId;
    } else if (type === 'antiraid') {
      const actionVal = validateAction(readText(fields, 'action'), ['mute', 'kick', 'ban'], 'Action', errors);
      if (actionVal !== null) updateData['Mod.AntiRaid.action'] = actionVal;

      const maxJoinsNum = validateNumber(readText(fields, 'max_joins'), 1, 50, 'Max joins per minute', errors);
      if (maxJoinsNum !== null) updateData['Mod.AntiRaid.maxJoinsPerMinute'] = maxJoinsNum;

      const minAgeNum = validateNumber(readText(fields, 'min_account_age_hours'), 1, 720, 'Min account age (hours)', errors);
      if (minAgeNum !== null) updateData['Mod.AntiRaid.minAccountAge'] = minAgeNum * 3600000;

      const lockdownNum = validateNumber(readText(fields, 'lockdown_duration'), 60, 3600, 'Lockdown duration (seconds)', errors);
      if (lockdownNum !== null) updateData['Mod.AntiRaid.lockdownDuration'] = lockdownNum * 1000;

      const channelId = await validateChannel(client, interaction, readText(fields, 'log_channel'), 'Log channel', errors);
      if (channelId !== null) updateData['Mod.AntiRaid.logChannel'] = channelId;
    } else if (type === 'badwords') {
      const words = parseDomains(readText(fields, 'words'), false);
      if (words !== null) updateData['Mod.BadWordsFilter.BDW'] = words;

      const actionVal = validateAction(readText(fields, 'action'), ['delete', 'warn', 'mute'], 'Action', errors);
      if (actionVal !== null) updateData['Mod.BadWordsFilter.action'] = actionVal;

      const channelId = await validateChannel(client, interaction, readText(fields, 'log_channel'), 'Log channel', errors);
      if (channelId !== null) updateData['Mod.BadWordsFilter.logChannel'] = channelId;
    } else if (type === 'honeypot') {
      const channel = await validateChannel(client, interaction, readText(fields, 'channel'), 'Honey pot channel', errors);
      if (channel !== null) updateData['Mod.HoneyPot.channel'] = channel;

      const actionVal = validateAction(readText(fields, 'action'), ['kick', 'ban'], 'Action', errors);
      if (actionVal !== null) updateData['Mod.HoneyPot.action'] = actionVal;

      const channelId = await validateChannel(client, interaction, readText(fields, 'log_channel'), 'Log channel', errors);
      if (channelId !== null) updateData['Mod.HoneyPot.logChannel'] = channelId;
    }

    if (errors.length > 0) {
      return interaction.editReply({
        embeds: [ErrorEmbed(`❌ **Validation failed** — please fix the following:\n\n${errors.join('\n')}`)],
      });
    }

    if (Object.keys(updateData).length === 0) {
      return interaction.editReply({
        embeds: [WarningEmbed('⚠️ No changes detected. Edit the fields and try again.')],
      });
    }

    const prevGuildData = await client.getCachedGuildData(interaction.guildId).catch(() => null);

    const updated = await GuildSchema.findOneAndUpdate(
      { GuildID: interaction.guildId },
      { $set: updateData },
      { upsert: true, new: true, lean: true },
    ).catch(() => null);

    if (updated) {
      client.setCachedGuildData(interaction.guildId, updated);
    }

    // Configure the honey pot channel (rename + warn topic + announcement) only
    // when the assigned channel actually changed
    if (type === 'honeypot' && updateData['Mod.HoneyPot.channel']) {
      const previous = prevGuildData?.Mod?.HoneyPot?.channel;
      if (previous !== updateData['Mod.HoneyPot.channel']) {
        await setupHoneyPotChannel(client, interaction.guild, updateData['Mod.HoneyPot.channel']);
      }
    }

    const freshData = await client.getCachedGuildData(interaction.guildId, { force: true }).catch(() => updated);
    const embed = buildProtectorEmbed(client, freshData, type, { footerUser: interaction.user });

    const replyEmbed = updated
      ? SuccessEmbed(`✅ **${cfg.emoji} ${cfg.label} settings updated successfully!**`)
      : ErrorEmbed('❌ There was an error while saving settings to the database.');

    await interaction.editReply({
      embeds: [replyEmbed, embed],
      components: [buildProtectorButtons(type)],
    });
  },
};

/** Read a text input safely (returns '' if missing) */
function readText(fields, id) {
  try { return fields.getTextInputValue(id).trim(); } catch { return ''; }
}

/**
 * Parse a comma-separated list (domains or words). Empty input returns []
 * so the saved list is always replaced by whatever the admin entered.
 * @param {string} raw
 * @param {boolean} [lowercase=true]
 * @returns {string[]|null}
 */
function parseDomains(raw, lowercase = true) {
  if (!raw.trim()) return [];
  const items = raw.split(',').map(v => (lowercase ? v.trim().toLowerCase() : v.trim())).filter(Boolean);
  return items;
}

/**
 * Validate an integer within a range. Returns the parsed number, or null if the
 * field was left empty (no change). Pushes an error message on invalid input.
 * @param {string} raw
 * @param {number} min
 * @param {number} max
 * @param {string} label
 * @param {string[]} errors
 * @returns {number|null}
 */
function validateNumber(raw, min, max, label, errors) {
  if (!raw) return null;

  const num = Number(raw);
  if (!Number.isInteger(num) || num < min || num > max) {
    errors.push(`❌ **${label}** — must be a whole number between **${min}** and **${max}**.`);
    return null;
  }
  return num;
}

/**
 * Validate an action value against an allowed list. Returns the lowercased
 * value, or null if the field was left empty. Pushes an error on invalid input.
 * @param {string} raw
 * @param {string[]} allowed
 * @param {string} label
 * @param {string[]} errors
 * @returns {string|null}
 */
function validateAction(raw, allowed, label, errors) {
  if (!raw) return null;

  const val = raw.toLowerCase();
  if (!allowed.includes(val)) {
    errors.push(`❌ **${label}** — must be one of: \`${allowed.join('`, `')}\`.`);
    return null;
  }
  return val;
}

/**
 * Validate a channel ID. Returns the channel ID string, or null if the field
 * was left empty. Pushes an error if the channel doesn't exist in the guild,
 * isn't a text channel, or the bot lacks access.
 * @param {import('../../struct/Client')} client
 * @param {import('discord.js').ModalSubmitInteraction} interaction
 * @param {string} raw
 * @param {string} label
 * @param {string[]} errors
 * @returns {Promise<string|null>}
 */
async function validateChannel(client, interaction, raw, label, errors) {
  if (!raw) return null;

  const id = raw.replace(/[<#>]/g, '').trim();
  if (!/^\d{17,20}$/.test(id)) {
    errors.push(`❌ **${label}** — \`${raw}\` is not a valid channel ID.`);
    return null;
  }

  const guild = interaction.guild;
  const channel = guild?.channels?.cache?.get(id);

  if (!channel) {
    errors.push(`❌ **${label}** — no channel with ID \`${id}\` exists in this server.`);
    return null;
  }

  if (!channel.isTextBased()) {
    errors.push(`❌ **${label}** — <#${id}> is not a text channel.`);
    return null;
  }

  const botMember = guild?.members?.me;
  if (botMember && !channel.permissionsFor(botMember)?.has(['ViewChannel', 'SendMessages', 'EmbedLinks'])) {
    errors.push(`❌ **${label}** — the bot does not have \`View Channel\`, \`Send Messages\`, and \`Embed Links\` permissions in <#${id}>.`);
    return null;
  }

  return id;
}
