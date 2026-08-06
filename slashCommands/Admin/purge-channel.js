const { EmbedBuilder, ChannelType } = require('discord.js');
const { colors } = require('../../util/constants/constants');
const { confirmAction } = require('../../util/moderation/confirmAction');

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "purge-channel",
    description: "Recreate the current channel without messages",
    dmOnly: false,
    guildOnly: true,
    cooldown: 20,
    group: "Moderation",
    clientPermissions: ["ManageMessages", "ManageChannels"],
    permissions: ["ManageMessages", "ManageChannels"]
  },
  async execute(client, interaction) {
    const { channel, guild } = interaction;

    if (channel.type !== ChannelType.GuildText) {
      return interaction.reply({
        content: "❌ This command can only be used in text channels!",
        flags: ['Ephemeral']
      });
    }

    const confirmEmbed = new EmbedBuilder()
      .setColor(colors.ADMIN)
      .setDescription(`⚠️ Are you sure you want to purge **${channel}**? This will delete and recreate the channel!`)
      .setFooter({
        text: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 })
      })
      .setTimestamp();

    const confirmed = await confirmAction(interaction, {
      embeds: [confirmEmbed],
      confirmId: 'confirm_purge_channel',
      cancelId: 'cancel_purge_channel',
      confirmLabel: 'Yes',
      cancelLabel: 'No',
    });
    if (!confirmed) return;

    const nukeEmbed = new EmbedBuilder()
      .setColor(colors.ADMIN)
      .setDescription("⏱️ Purging channel in 3 seconds...");

    await interaction.editReply({ embeds: [nukeEmbed], components: [] }).catch(() => null);

    setTimeout(async () => {
      try {
        const { name, parent, topic, nsfw, rateLimitPerUser, permissionOverwrites } = channel;

        const newChannel = await guild.channels.create({
          name,
          type: ChannelType.GuildText,
          parent: parent ? parent.id : null,
          topic,
          nsfw,
          rateLimitPerUser,
          permissionOverwrites: permissionOverwrites.cache
        });

        const successEmbed = new EmbedBuilder()
          .setColor(colors.ADMIN)
          .setDescription(`✅ Channel purged by ${interaction.user.toString()}`)
          .setTimestamp();

        await newChannel.send({ embeds: [successEmbed] });

        await channel.delete();
      } catch (error) {
        console.error(error);

        const errorEmbed = new EmbedBuilder()
          .setColor(colors.ERROR)
          .setDescription("❌ There was an error while trying to purge the channel!");

        await interaction.editReply({ embeds: [errorEmbed], components: [] }).catch(() => null);
      }
    }, 3000);
  },
};
