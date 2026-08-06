const { ApplicationCommandOptionType } = require('discord.js');
const { checkModerationTarget } = require('../../util/moderation/targetChecks');
const { buildActionEmbed } = require('../../util/moderation/embeds');

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "softban",
    description: "Ban a user, delete their recent messages, then immediately unban them",
    dmOnly: false,
    guildOnly: true,
    cooldown: 3,
    group: "Moderation",
    clientPermissions: ["BanMembers"],
    permissions: ["BanMembers"],
    options: [
      {
        type: ApplicationCommandOptionType.User,
        name: 'user',
        description: 'The user to softban',
        required: true
      },
      {
        type: ApplicationCommandOptionType.Integer,
        name: 'days',
        description: 'Days of message history to delete (0-7)',
        required: false,
        min_value: 0,
        max_value: 7
      },
      {
        type: ApplicationCommandOptionType.String,
        name: 'reason',
        description: 'The reason for the softban',
        required: false
      }
    ]
  },
  async execute(client, interaction) {
    const { guild } = interaction;
    const user = interaction.options.getUser("user");
    const days = interaction.options.getInteger("days") ?? 7;
    const reason = interaction.options.getString("reason") || 'No reason specified';

    const check = await checkModerationTarget(client, interaction, 'softban', { optionName: 'user' });
    if (!check.ok) {
      return interaction.reply({ content: check.content, flags: ['Ephemeral'] });
    }
    const { member } = check;

    await interaction.deferReply();

    try {
      // Ban the user, deleting up to `days` of message history (0 = keep messages)
      await guild.members.ban(member, {
        reason: `Wolfy SOFTBAN: ${interaction.user.username}: ${reason}`,
        deleteMessageSeconds: days * 86400,
      });

      // Unban the user
      await guild.members.unban(user.id, `Wolfy SOFTBAN: ${interaction.user.username}`);

      const softbanEmbed = buildActionEmbed({
        target: member,
        executor: interaction.user,
        description: [
          `Successfully softbanned the user from ${guild.name}!`,
          `- Moderator: ${interaction.user.username}`,
          `- Messages deleted: **${days} day${days === 1 ? '' : 's'}**`,
          reason ? `- Reason: ${reason}` : ''
        ].join('\n'),
      });

      return interaction.editReply({ embeds: [softbanEmbed] });
    } catch (error) {
      console.error(error);
      return interaction.editReply({
        content: `❌ | I couldn't softban **${user.username}**!`,
        flags: ['Ephemeral'],
      }).catch(() => null);
    }
  },
}; 