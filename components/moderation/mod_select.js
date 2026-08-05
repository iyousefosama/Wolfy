const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const { PROTECTOR_CONFIG, PROTLECT_ORDER, buildProtectorEmbed, buildProtectorButtons } = require('../../util/functions/moderationDashboard');
const { InfoEmbed } = require('../../util/modules/embeds');

/**
 * mod_select — StringSelectMenu handler
 *
 * Triggered when a user picks a protector from the "choose a module" dropdown.
 * Replaces the current message with that protector's detail embed + Configure/Toggle buttons.
 *
 * Routed via ComponentsListener:
 *   customId "mod_select" → split ["mod","select"] → componentId "mod_select" → exact match.
 *
 * @type {import("../../util/types/baseComponent")}
 */
module.exports = {
  name: 'mod_select',
  enabled: true,

  async action(client, interaction) {
    const type = interaction.values?.[0];

    if (!type || !PROTECTOR_CONFIG[type]) {
      return interaction.reply({
        embeds: [InfoEmbed('❌ Invalid selection. Please choose a moderation module from the list.')],
        flags: ['Ephemeral'],
      });
    }

    let guildData = null;
    if (client.database?.connected) {
      try {
        guildData = await client.getCachedGuildData(interaction.guildId);
      } catch {
        guildData = null;
      }
    }

    const embed = buildProtectorEmbed(client, guildData, type, {
      footerUser: interaction.user,
    });

    await interaction.update({
      embeds: [embed],
      components: [buildProtectorButtons(type)],
    });
  },

  /**
   * Helper to build the select menu row (used by the mod_choose button).
   * Reuses the same Options/Rows logic so the menu is defined in one place.
   */
  buildSelectMenuRow() {
    const select = new StringSelectMenuBuilder()
      .setCustomId('mod_select')
      .setPlaceholder('Choose a moderation module to configure...')
      .setMinValues(1)
      .setMaxValues(1);

    for (const key of PROTLECT_ORDER) {
      const cfg = PROTECTOR_CONFIG[key];
      select.addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel(cfg.label)
          .setDescription(cfg.short.slice(0, 50))
          .setValue(key)
          .setEmoji(cfg.emoji),
      );
    }

    return new ActionRowBuilder().addComponents(select);
  },
};
