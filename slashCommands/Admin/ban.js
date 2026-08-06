const { ApplicationCommandOptionType } = require("discord.js");
const { checkModerationTarget } = require("../../util/moderation/targetChecks");
const { buildActionEmbed } = require("../../util/moderation/embeds");

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "ban",
    description: "Ban a member from the server",
    dmOnly: false,
    guildOnly: true,
    cooldown: 3,
    group: "Moderation",
    clientPermissions: ["BanMembers"],
    permissions: [
      "BanMembers"
    ],
    options: [
      {
        type: ApplicationCommandOptionType.User,
        name: 'target',
        description: 'The user to kick from server',
        required: true
      },
      {
        type: ApplicationCommandOptionType.String,
        name: 'reason',
        description: 'The reason of the kick',
        required: false
      }
    ]
  },
  async execute(client, interaction) {
    const { guild, options } = interaction;
    const reason = options.getString("reason");

    const check = await checkModerationTarget(client, interaction, 'ban');
    if (!check.ok) {
      return interaction.reply({ content: check.content, flags: ['Ephemeral'] });
    }
    const { member } = check;

    const embed = buildActionEmbed({
      target: member,
      executor: interaction.user,
      description: [
        `Successfully **banned** the user from ${guild.name}!`,
        reason ? `- Ban reason: ${reason}` : ''
      ].join('\n'),
    });

    return guild.members.ban(member, { reason: `Wolfy BAN: ${interaction.user.username}: ${reason || 'Unspecified'}` })
      .then(() => interaction.reply({ embeds: [embed] }))
      .catch(() => interaction.reply({ content: `❌ | I couldn't **ban** that user!`, flags: ['Ephemeral'] }));
  },
};
