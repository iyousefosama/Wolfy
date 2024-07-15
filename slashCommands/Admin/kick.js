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
        /**
         * @type {import("discord.js").User}
         */
        const user = options.getUser("target");
        /**
         * @type {string}
         */
        const reason = options.getString("reason");

        if (!user.id.match(/\d{17,19}/)){
            return interaction.reply({ content: `\\❌ Please choose valid member to kick!`, ephemeral: true });
          };
      
          const member = await interaction.guild.members
          .fetch(user.id.match(/\d{17,19}/)[0])
          .catch(() => null);
    
        if (!member){
          return interaction.reply({ content: `\\❌ User could not be found! Please ensure the supplied ID is valid.`, ephemeral: true});
        } else if (member.id === interaction.user.id){
          return interaction.reply({ content: `\\❌ You cannot kick yourself!`, ephemeral: true });
        } else if (member.id === client.user.id){
          return interaction.reply({ content: `\\❌ You cannot kick me!`, ephemeral: true });
        } else if (member.id === interaction.guild.ownerId){
          return interaction.reply({ content: `\\❌ You cannot kick a server owner!`, ephemeral: true });
        } else if (client.owners.includes(member.id)){
          return interaction.reply({ content: `\\❌ You can't kick my developer through me!`, ephemeral: true });
        } else if (interaction.member.roles.highest.position < member.roles.highest.position){
          return interaction.reply({ content: `\\❌ You can't kick that user! He/She has a higher role than yours`, ephemeral: true });
        } else if (!member.kickable){
          return interaction.reply({ content: `\\❌ I couldn't kick that user!`, ephemeral: true })
        };
        const kick = new EmbedBuilder()
        .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL({dynamic: true, size: 2048}) })
        .setDescription([ `<:tag:813830683772059748> Successfully Kicked the user from the server`, !reason ? '' :
        ` for reason: \`${reason || 'Unspecified'}\`` ].join(''))
        .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({dynamic: true, size: 2048}) })
        .setTimestamp()
        return member.kick({ reason: `Wolfy KICK: ${interaction.user.username}: ${reason || 'Unspecified'}`})
        .then(_member => interaction.reply({ embeds: [kick]}))
        .catch(() => interaction.reply({ content: `\\❌ Failed to kick **${member.user.username}**!`, ephermal: true }));
    },
};
