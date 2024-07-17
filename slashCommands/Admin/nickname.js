/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
    data: {
        name: "nickname",
        description: "Changes/Resets the nickname of the member",
        dmOnly: false,
        guildOnly: true,
        cooldown: 3,
        group: "Moderation",
        clientPermissions: ["ManageNicknames"],
        permissions: [
            "ManageNicknames"
        ],
        options: [
            {
                type: 3, // STRING
                name: 'nickname',
                description: 'The new nickname',
                required: false
            },
            {
                type: 6, // USER
                name: 'target',
                description: 'A user to change nickname for',
                required: false
            }
        ]
    },
    async execute(client, interaction) {
        const { guild, options } = interaction;
        const user = options.getUser("target");
        const nickname = options.getString("nickname");

        const id = (user?.id.match(/\d{17,19}/) || [])[0] || interaction.user.id;
        const member = await guild.members.fetch(id)
            .catch(() => interaction.member);

        if (!member) {
            return interaction.reply({ content: `\\❌ User could not be found! Please ensure the supplied ID is valid.`, ephemeral: true });
        } else if (member.id === client.user.id) {
            return interaction.reply({ content: `\\❌ You cannot change nickname for me!`, ephemeral: true });
        } else if (member.id === guild.ownerId) {
            return interaction.reply({ content: `\\❌ You cannot change nickname of the owner!`, ephemeral: true });
        } else if (client.owners.includes(member.id)) {
            return interaction.reply({ content: `\\❌ You cannot change nickname for my developer through me!`, ephemeral: true });
        } else if (interaction.member.roles.highest.position < member.roles.highest.position) {
            return interaction.reply({ content: `\\❌ You can't change nickname for that user! He/She has a higher role than yours`, ephemeral: true });
        };

        if (!nickname) {
            return member.setNickname(null, `Wolfy Nickname: ${interaction.user.username}`)
                .then(() => interaction.reply(`\\✔️ Successfully reseted the nickname for **${member.user.username}**!`))
                .catch(() => interaction.reply(`\\❌ Unable to change the nickname for **${member.user.username}**!`));
        }



        return member.setNickname(nickname, `Wolfy Nickname: ${interaction.user.username}`)
            .then(() => interaction.reply({ content: `\\✔️ Successfully changed **${member.user.username}** nickname to \`${nickname}\`!` }))
            .catch(() => interaction.reply(`\\❌ Unable to change the nickname for **${member.user.username}**!`));
    },
};
