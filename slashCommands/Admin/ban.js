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

        if (!user.id.match(/\d{17,19}/)){
            return interaction.reply({ content: `\\❌ Please choose valid member to ban!`, ephemeral: true });
          };
      
          const member = await guild.members
          .fetch(user.id.match(/\d{17,19}/)[0])
          .catch(() => null);
    
        if (!member){
          return interaction.reply({ content: `\\❌ User could not be found! Please ensure the supplied ID is valid.`, ephemeral: true});
        } else if (member.id === interaction.user.id){
          return interaction.reply({ content: `\\❌ You cannot ban yourself!`, ephemeral: true });
        } else if (member.id === client.user.id){
          return interaction.reply({ content: `\\❌ You cannot ban me!`, ephemeral: true });
        } else if (member.id === guild.ownerId){
          return interaction.reply({ content: `\\❌ You cannot ban a server owner!`, ephemeral: true });
        } else if (client.owners.includes(member.id)){
          return interaction.reply({ content: `\\❌ You can't ban my developer through me!`, ephemeral: true });
        } else if (interaction.member.roles.highest.position < member.roles.highest.position){
          return interaction.reply({ content: `\\❌ You can't ban that user! He/She has a higher role than yours`, ephemeral: true });
        } else if (!member.bannable){
          return interaction.reply({ content: `\\❌ I couldn't ban that user!`, ephemeral: true })
        };

        const ban = new EmbedBuilder()
        .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL({dynamic: true, size: 2048})})
        .setDescription([ `<:tag:813830683772059748> Successfully Banned the user from the server`, !reason ? '' :
        ` for reason: \`${reason || 'Unspecified'}\`` ].join(''))
        .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({dynamic: true, size: 2048})})
        .setTimestamp()
    
        return guild.members.ban(member, { reason:  `Wolfy BAN: ${interaction.user.username}: ${reason || 'Unspecified'}` })
        .then(() => interaction.reply({ embeds: [ban]}))
        .catch(() => interaction.reply({ content: `\\❌ Unable to ban **${member.user.username}**!`, ephermal: true }));
    },
};
