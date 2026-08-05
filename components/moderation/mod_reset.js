const { buildConfirmButtons } = require('../../util/functions/moderationDashboard');
const { WarningEmbed } = require('../../util/modules/embeds');

/**
 * mod_reset — Button handler
 *
 * Initiates the "reset all protection settings" flow by showing a
 * confirmation prompt with Yes / Cancel buttons.
 * Button customId: `mod_reset` → parts ["mod","reset"].
 *
 * @type {import("../../util/types/baseComponent")}
 */
module.exports = {
  name: 'mod_reset',
  enabled: true,

  async action(client, interaction) {
    const confirmEmbed = WarningEmbed(
      '⚠️ **Reset All Moderation Settings**\n\n' +
      'This will restore **all** protection modules to their default values and ' +
      'disable them. This action **cannot be undone**.\n\n' +
      'Are you sure you want to proceed?',
    );

    await interaction.update({
      embeds: [confirmEmbed],
      components: [buildConfirmButtons()],
    });
  },
};
