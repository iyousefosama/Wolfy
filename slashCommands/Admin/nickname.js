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
            return interaction.reply({ content: client.language.getString("USER_NOT_FOUND", interaction.guildId), ephemeral: true });
        } else if (member.id === client.user.id) {
            return interaction.reply({ content: client.language.getString("CANNOT_MODERATE_BOT", interaction.guildId, { action: "NICKNAME" }), ephemeral: true });
        } else if (member.id === guild.ownerId) {
            return interaction.reply({ content: client.language.getString("CANNOT_MODERATE_OWNER", interaction.guildId, { action: "NICKNAME" }), ephemeral: true });
        } else if (client.owners.includes(member.id)) {
            return interaction.reply({ content: client.language.getString("CANNOT_MODERATE_DEV", interaction.guildId, { action: "NICKNAME" }), ephemeral: true });
        } else if (interaction.member.roles.highest.position < member.roles.highest.position) {
            return interaction.reply({ content: client.language.getString("CANNOT_MODERATE_HIGHER", interaction.guildId, { action: "NICKNAME" }), ephemeral: true });
        };

        if (!nickname) {
            return member.setNickname(null, `Wolfy Nickname: ${interaction.user.username}`)
                .then(() => interaction.reply(client.language.getString("MODERATE_SUCCESS", interaction.guildId, { action_done: "NICKNAME", target: member.user.username })))
                .catch(() => interaction.reply(client.language.getString("CANNOT_MODERATE", interaction.guildId, { action: "NICKNAME" })));
        }

        return member.setNickname(nickname, `Wolfy Nickname: ${interaction.user.username}`)
            .then(() => interaction.reply({ content: client.language.getString("MODERATE_SUCCESS", interaction.guildId, { action_done: "NICKNAME", target: member.user.username }) }))
            .catch(() => interaction.reply(client.language.getString("CANNOT_MODERATE", interaction.guildId, { action: "NICKNAME" })));
    },
};
