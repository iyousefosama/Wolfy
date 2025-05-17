const { EmbedBuilder } = require("discord.js");

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
        type: 6, // USER
        name: 'target',
        description: 'The user to kick from server',
        required: true
      },
      {
        type: 3, // STRING
        name: 'reason',
        description: 'The reason of the kick',
        required: false
      }
    ]
  },
  async execute(client, interaction) {
    const { guild, options } = interaction;
    const user = options.getUser("target");
    const reason = options.getString("reason");

    if (!user.id.match(/\d{17,19}/)) {
      return interaction.reply({ content: client.language.getString("NO_ID", interaction.guildId, { action: "KICK" }), ephemeral: true });
    };

    const member = await guild.members
      .fetch(user.id.match(/\d{17,19}/)[0])
      .catch(() => null);

    if (!member) {
      return interaction.reply({ content: client.language.getString("USER_NOT_FOUND", interaction.guildId), ephemeral: true });
    } else if (member.id === interaction.user.id) {
      return interaction.reply({ content: client.language.getString("CANNOT_MODERATE_SELF", interaction.guildId, { action: "KICK" }), ephemeral: true });
    } else if (member.id === client.user.id) {
      return interaction.reply({ content: client.language.getString("CANNOT_MODERATE_BOT", interaction.guildId, { action: "KICK" }), ephemeral: true });
    } else if (member.id === guild.ownerId) {
      return interaction.reply({ content: client.language.getString("CANNOT_MODERATE_OWNER", interaction.guildId, { action: "KICK" }), ephemeral: true });
    } else if (client.owners.includes(member.id)) {
      return interaction.reply({ content: client.language.getString("CANNOT_MODERATE_DEV", interaction.guildId, { action: "KICK" }), ephemeral: true });
    } else if (interaction.member.roles.highest.position < member.roles.highest.position) {
      return interaction.reply({ content: client.language.getString("CANNOT_MODERATE_HIGHER", interaction.guildId, { action: "KICK" }), ephemeral: true });
    } else if (!member.kickable) {
      return interaction.reply({ content: client.language.getString("CANNOT_MODERATE", interaction.guildId, { action: "KICK" }), ephemeral: true })
    };

    const kick = new EmbedBuilder()
      .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
      .setDescription([
        client.language.getString("MODERATE_SUCCESS", interaction.guildId, { action_done: "KICK", target: interaction.guild.name }),
        !reason ? '' : client.language.getString("MODERATE_REASON", interaction.guildId, { action: "KICK", reason: reason || 'Unspecified' })
      ].join('\n'))
      .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
      .setTimestamp()
    return member.kick({ reason: `Wolfy KICK: ${interaction.user.username}: ${reason || 'Unspecified'}` })
      .then(_member => interaction.reply({ embeds: [kick] }))
      .catch(() => interaction.reply({ content: client.language.getString("CANNOT_MODERATE", interaction.guildId, { action: "KICK" }), ephermal: true }));
  },
};
