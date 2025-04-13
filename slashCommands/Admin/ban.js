const { EmbedBuilder } = require("discord.js");

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
      return interaction.reply({ content: client.language.getString("NO_ID", interaction.guild.id, { action: "BAN" }), ephemeral: true });
    };

    const member = await guild.members
      .fetch(user.id.match(/\d{17,19}/)[0])
      .catch(() => null);

    if (!member) {
      return interaction.reply({ content: client.language.getString("USER_NOT_FOUND", interaction.guild.id), ephemeral: true });
    } else if (member.id === interaction.user.id) {
      return interaction.reply({ content: client.language.getString("CANNOT_MODERATE_SELF", interaction.guild.id, { action: "BAN" }), ephemeral: true });
    } else if (member.id === client.user.id) {
      return interaction.reply({ content: client.language.getString("CANNOT_MODERATE_BOT", interaction.guild.id, { action: "BAN" }), ephemeral: true });
    } else if (member.id === guild.ownerId) {
      return interaction.reply({ content: client.language.getString("CANNOT_MODERATE_OWNER", interaction.guild.id, { action: "BAN" }), ephemeral: true });
    } else if (client.owners.includes(member.id)) {
      return interaction.reply({ content: client.language.getString("CANNOT_MODERATE_DEV", interaction.guild.id, { action: "BAN" }), ephemeral: true });
    } else if (interaction.member.roles.highest.position < member.roles.highest.position) {
      return interaction.reply({ content: client.language.getString("CANNOT_MODERATE_HIGHER", interaction.guild.id, { action: "BAN" }), ephemeral: true });
    } else if (!member.bannable) {
      return interaction.reply({ content: client.language.getString("CANNOT_MODERATE", interaction.guild.id, { action: "BAN" }), ephemeral: true })
    };

    const ban = new EmbedBuilder()
      .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
      .setDescription([
        client.language.getString("MODERATE_SUCCESS", interaction.guild.id, { action_done: "BAN", target: interaction.guild.name }),
        !reason ? '' : client.language.getString("MODERATE_REASON", interaction.guild.id, { action: "BAN", reason: reason || 'Unspecified' })
      ].join('\n'))
      .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
      .setTimestamp()

    return guild.members.ban(member, { reason: `Wolfy BAN: ${interaction.user.username}: ${reason || 'Unspecified'}` })
      .then(() => interaction.reply({ embeds: [ban] }))
      .catch(() => interaction.reply({ content: client.language.getString("CANNOT_MODERATE", interaction.guild.id, { action: "BAN" }), ephermal: true }));
  },
};
