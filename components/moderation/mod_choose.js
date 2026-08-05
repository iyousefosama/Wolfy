const { InfoEmbed } = require('../../util/modules/embeds');

/**
 * mod_choose — Button handler
 *
 * Triggered when a user clicks the "Configure" (⚙️) button on the main dashboard.
 * Replaces the dashboard with a StringSelectMenu so the user can pick which
 * protector they want to configure.
 *
 * Routed via ComponentsListener:
 *   customId "mod_choose" → split ["mod","choose"] → componentId "mod_choose" → exact match.
 *
 * @type {import("../../util/types/baseComponent")}
 */
module.exports = {
  name: 'mod_choose',
  enabled: true,

  async action(client, interaction) {
    const selectComponent = require('./mod_select');
    const row = selectComponent.buildSelectMenuRow();

    await interaction.update({
      embeds: [InfoEmbed('Select a moderation module below to configure its settings.')],
      components: [row],
    });
  },
};
