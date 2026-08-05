const GuildSchema = require('../../schema/GuildSchema');
const { PROTECTOR_CONFIG, buildProtectorEmbed, buildProtectorButtons } = require('../../util/functions/moderationDashboard');
const { SuccessEmbed, ErrorEmbed } = require('../../util/modules/embeds');

/**
 * mod_toggle — Button handler
 *
 * Quick on/off toggle for a single protector.
 * Button customId: `mod_toggle_<type>` → parts ["mod","toggle",<type>].
 *
 * @type {import("../../util/types/baseComponent")}
 */
module.exports = {
  name: 'mod_toggle',
  enabled: true,

  async action(client, interaction, parts) {
    const type = parts?.[2];

    if (!type || !PROTECTOR_CONFIG[type]) {
      return interaction.reply({
        embeds: [ErrorEmbed('❌ Could not determine which protection module to toggle.')],
        flags: ['Ephemeral'],
      });
    }

    const cfg = PROTECTOR_CONFIG[type];
    const path = `Mod.${cfg.key}.${cfg.toggleField}`;

    let guildData = await client.getCachedGuildData(interaction.guildId).catch(() => null);
    const currentNode = guildData?.Mod?.[cfg.key] ?? {};
    const currentlyEnabled = !!currentNode[cfg.toggleField];

    const updated = await GuildSchema.findOneAndUpdate(
      { GuildID: interaction.guildId },
      { $set: { [path]: !currentlyEnabled } },
      { upsert: true, new: true, lean: true },
    ).catch(() => null);

    if (updated) {
      client.setCachedGuildData(interaction.guildId, updated);
      guildData = updated;
    } else {
      if (currentNode) currentNode[cfg.toggleField] = !currentlyEnabled;
      guildData = guildData || { GuildID: interaction.guildId, Mod: {} };
    }

    const newState = !currentlyEnabled;
    const message = newState
      ? SuccessEmbed(`✅ **${cfg.emoji} ${cfg.label}** has been **enabled**.`)
      : SuccessEmbed(`❌ **${cfg.emoji} ${cfg.label}** has been **disabled**.`);

    const embed = buildProtectorEmbed(client, guildData, type, { footerUser: interaction.user });

    await interaction.reply({
      embeds: [message, embed],
      components: [buildProtectorButtons(type)],
      flags: ['Ephemeral'],
    });
  },
};
