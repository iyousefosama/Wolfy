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
        /**
         * @type {string}
         */
        const user = options.getString("target");
        /**
         * @type {string}
         */
        const reason = options.getString("reason");

        if (!user.match(/\d{17,19}/)) {
            return interaction.reply({ content: `\\❌ Please choose valid member to unban!`, ephermal: true });
        };

        return interaction.guild.members.unban(user, { reason: `Wolfy Unban: ${interaction.user.username}: ${reason || 'None'}`})
        .then(user => interaction.reply({ content: `<a:Correct:812104211386728498> Successfully unbanned **${user.tag}**!`}))
        .catch(() => interaction.reply({ content: `\\❌ Unable to unban user with ID ${user}.`, ephermal: true }));

    },
};
