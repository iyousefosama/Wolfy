const { ApplicationCommandOptionType } = require("discord.js");
const { checkModerationTarget } = require("../../util/moderation/targetChecks");
const { buildActionEmbed } = require("../../util/moderation/embeds");

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "kick",
    description: "Kick a member from the server",
    dmOnly: false,
    guildOnly: true,
    cooldown: 3,
    group: "Moderation",
    clientPermissions: ["KickMembers"],
    permissions: [
      "KickMembers"
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

    const check = await checkModerationTarget(client, interaction, 'kick');
    if (!check.ok) {
      return interaction.reply({ content: check.content, flags: ['Ephemeral'] });
    }
    const { member } = check;

    const embed = buildActionEmbed({
      target: member,
      executor: interaction.user,
      description: [
        `Successfully **kicked** the user from ${guild.name}!`,
        reason ? `- Kick reason: ${reason}` : ''
      ].join('\n'),
    });

    return member.kick({ reason: `Wolfy KICK: ${interaction.user.username}: ${reason || 'Unspecified'}` })
      .then(() => interaction.reply({ embeds: [embed] }))
      .catch(() => interaction.reply({ content: `❌ | I couldn't **kick** that user!`, flags: ['Ephemeral'] }));
  },
};