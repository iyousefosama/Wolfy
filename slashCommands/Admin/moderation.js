const {
  buildDashboardEmbed,
  buildDashboardButtons,
} = require('../../util/functions/moderationDashboard');

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: 'moderation',
    description: 'Open the automated moderation dashboard',
    dmOnly: false,
    guildOnly: true,
    cooldown: 3,
    group: 'Moderation',
    requiresDatabase: true,
    clientPermissions: ['Administrator'],
    permissions: ['Administrator'],
    options: [],
  },
  async execute(client, interaction) {
    await interaction.deferReply({ flags: ['Ephemeral'] }).catch(() => {});

    let guildData = null;
    if (client.database?.connected) {
      try {
        guildData = await client.getCachedGuildData(interaction.guild.id);
      } catch (err) {
        console.log(err);
      }
    }

    const embed = buildDashboardEmbed(client, guildData)
      .setFooter({
        text: `Requested by ${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL(),
      });

    const components = [buildDashboardButtons()];

    await interaction.editReply({
      embeds: [embed],
      components,
      allowedMentions: { parse: [] },
    });
  },
};
