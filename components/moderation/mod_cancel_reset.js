const { buildDashboardEmbed, buildDashboardButtons } = require('../../util/functions/moderationDashboard');

/**
 * mod_cancel_reset — Button handler
 *
 * Cancels the reset and returns to the dashboard.
 * Button customId: `mod_cancel_reset` → parts ["mod","cancel","reset"].
 *
 * @type {import("../../util/types/baseComponent")}
 */
module.exports = {
  name: 'mod_cancel_reset',
  enabled: true,

  async action(client, interaction) {
    let guildData = null;
    try {
      guildData = await client.getCachedGuildData(interaction.guildId);
    } catch {
      guildData = null;
    }

    const embed = buildDashboardEmbed(client, guildData)
      .setFooter({
        text: `Requested by ${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL(),
      });

    await interaction.update({
      embeds: [embed],
      components: [buildDashboardButtons()],
    });
  },
};
