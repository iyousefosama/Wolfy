const { buildFullSummaryEmbed, buildDashboardButtons } = require('../../util/functions/moderationDashboard');
const { InfoEmbed } = require('../../util/modules/embeds');

/**
 * mod_view — Button handler
 *
 * Shows a comprehensive summary of ALL protector settings in one embed.
 * Button customId: `mod_view` → parts ["mod","view"].
 *
 * @type {import("../../util/types/baseComponent")}
 */
module.exports = {
  name: 'mod_view',
  enabled: true,

  async action(client, interaction) {
    let guildData = await client.getCachedGuildData(interaction.guildId).catch(() => null);

    if (!guildData) {
      return interaction.update({
        embeds: [InfoEmbed('⚠️ No moderation data found for this server. Set up a protection module first!')],
        components: [buildDashboardButtons()],
      });
    }

    const embed = buildFullSummaryEmbed(client, guildData);
    embed.setFooter({
      text: `Requested by ${interaction.user.username}`,
      iconURL: interaction.user.displayAvatarURL(),
    });

    await interaction.update({
      embeds: [embed],
      components: [buildDashboardButtons()],
    });
  },
};
