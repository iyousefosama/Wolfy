const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const { colors } = require('../../util/constants/constants');

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "hackban",
    description: "Ban a user that is not in the server by ID",
    dmOnly: false,
    guildOnly: true,
    cooldown: 3,
    group: "Moderation",
    clientPermissions: ["BanMembers"],
    permissions: ["BanMembers"],
    options: [
      {
        type: ApplicationCommandOptionType.String,
        name: 'userid',
        description: 'The ID of the user to ban',
        required: true
      },
      {
        type: ApplicationCommandOptionType.String,
        name: 'reason',
        description: 'The reason for the ban',
        required: false
      }
    ]
  },
  async execute(client, interaction) {
    const { guild } = interaction;
    const userId = interaction.options.getString("userid");
    const reason = interaction.options.getString("reason") || 'Unspecified';
    const hasReason = reason !== 'Unspecified';

    if (!userId.match(/\d{17,19}/)) {
      return interaction.reply({
        content: "❌ | Please provide a valid Discord ID!",
        flags: ['Ephemeral']
      });
    }

    try {
      const user = await client.users.fetch(userId.match(/\d{17,19}/)[0]);

      const member = await guild.members.fetch(user.id).catch(() => null);

      if (member) {
        return interaction.reply({
          content: "❌ | This user is in the server! Please use the regular `ban` command instead!",
          flags: ['Ephemeral']
        });
      }

      if (user.id === guild.ownerId) {
        return interaction.reply({
          content: "❌ | You cannot hackban the server owner!",
          flags: ['Ephemeral']
        });
      }

      if (user.id === interaction.user.id) {
        return interaction.reply({
          content: "❌ | You cannot hackban yourself!",
          flags: ['Ephemeral']
        });
      }

      if (user.id === client.user.id) {
        return interaction.reply({
          content: "❌ | You cannot hackban me!",
          flags: ['Ephemeral']
        });
      }

      if (client.owners.includes(user.id)) {
        return interaction.reply({
          content: "❌ | You cannot hackban my developer!",
          flags: ['Ephemeral']
        });
      }

      const author = {
        name: user.username,
        iconURL: user.displayAvatarURL({ dynamic: true, size: 2048 })
      };
      const footer = {
        text: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 })
      };

      try {
        await guild.members.ban(user.id, {
          reason: `Wolfy Hackban Command: ${interaction.user.username}: ${reason}`
        });

        const banEmbed = new EmbedBuilder()
          .setColor(colors.ADMIN)
          .setAuthor(author)
          .setDescription([
            `Successfully hackbanned **${user.username}**!`,
            hasReason ? `- Reason: ${reason}` : ''
          ].join('\n'))
          .setFooter(footer)
          .setTimestamp();

        return interaction.reply({ embeds: [banEmbed] });
      } catch {
        return interaction.reply({
          content: `❌ | Failed to hackban **${user.username}**!`,
          flags: ['Ephemeral']
        });
      }
    } catch {
      return interaction.reply({
        content: "❌ | User not found!",
        flags: ['Ephemeral']
      });
    }
  },
};
