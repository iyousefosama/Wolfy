/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
    data: {
        name: "unban",
        description: "Unban a member from the server",
        dmOnly: false,
        guildOnly: true,
        cooldown: 2,
        group: "Moderation",
        clientPermissions: ["BanMembers"],
        permissions: [
            "BanMembers"
        ],
        options: [
            {
                type: 3, // USER
                name: 'target',
                description: 'The id of user to unban',
                required: true
            },
            {
                type: 3, // STRING
                name: 'reason',
                description: 'The reason of the unban',
                required: false
            }
        ]
    },
    async execute(client, interaction) {
        const { guild, options } = interaction;
        const user = options.getString("target");
        const reason = options.getString("reason");

        if (!user.match(/\d{17,19}/)) {
            return interaction.reply({ content: client.language.getString("NO_ID", interaction.guild.id, { action: "UNBAN" }), ephemeral: true });
        };

        return guild.members.unban(user, { reason: `Wolfy Unban: ${interaction.user.username}: ${reason || 'None'}`})
        .then(() => {
            const embed = new EmbedBuilder()
                .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
                .setDescription([
                    client.language.getString("MODERATE_SUCCESS", interaction.guild.id, { action_done: "UNBAN", target: interaction.guild.name }),
                    !reason ? '' : client.language.getString("MODERATE_REASON", interaction.guild.id, { action: "UNBAN", reason: reason || 'Unspecified' })
                ].join('\n'))
                .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
                .setTimestamp();
            return interaction.reply({ embeds: [embed] });
        })
        .catch(() => interaction.reply({ content: client.language.getString("CANNOT_MODERATE", interaction.guild.id, { action: "UNBAN" }), ephemeral: true }));
    },
};
