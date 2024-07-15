const ms = require('ms');

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
    data: {
        name: "timeout",
        description: "Prevents a user from talking or connecting to a voice channel for a period of time",
        dmOnly: false,
        guildOnly: true,
        cooldown: 3,
        group: "Moderation",
        clientPermissions: ["ModerateMembers"],
        permissions: ["ModerateMembers"],
        options: [
            {
                type: 6, // USER
                name: 'target',
                description: 'The user to timeout',
                required: true
            },
            {
                type: 3, // STRING
                name: 'time',
                description: 'The duration of the timeout (e.g., 5h), or type "0" to remove timeout',
                required: true
            },
            {
                type: 3, // STRING
                name: 'reason',
                description: 'The reason for the timeout',
                required: false
            }
        ]
    },
    async execute(client, interaction) {
        const { guild, options } = interaction;

        const user = options.getUser("target");
        const time = options.getString("time");
        const reason = options.getString("reason") || 'Unspecified';

        let timeoutDuration = ms(time);

        if (timeoutDuration === undefined) {
            return interaction.reply({ content: `\\❌ Please provide a valid time for the timeout!`, ephemeral: true });
        }

        if (timeoutDuration === 0) {
            timeoutDuration = null;
        }

        if (!user) {
            return interaction.reply({ content: `\\❌ Please choose a valid member to timeout!`, ephemeral: true });
        }

        const member = await guild.members.fetch(user.id).catch(() => null);

        if (!member) {
            return interaction.reply({ content: `\\❌ User could not be found! Please ensure the supplied ID is valid.`, ephemeral: true });
        } else if (member.id === interaction.user.id) {
            return interaction.reply({ content: `\\❌ You cannot timeout yourself!`, ephemeral: true });
        } else if (member.id === client.user.id) {
            return interaction.reply({ content: `\\❌ You cannot timeout me!`, ephemeral: true });
        } else if (member.id === guild.ownerId) {
            return interaction.reply({ content: `\\❌ You cannot timeout the server owner!`, ephemeral: true });
        } else if (client.owners && client.owners.includes(member.id)) {
            return interaction.reply({ content: `\\❌ You cannot timeout my developer through me!`, ephemeral: true });
        } else if (interaction.member.roles.highest.position <= member.roles.highest.position) {
            return interaction.reply({ content: `\\❌ You cannot timeout this user! They have a higher or equal role to yours.`, ephemeral: true });
        }

        try {
            await member.timeout(timeoutDuration, `Wolfy TIMEOUT: ${interaction.user.username}: ${reason}`);
            interaction.reply({ content: `\\✔️ Successfully ${timeoutDuration ? "timed out" : "removed timeout for"} the user **${member.user.username}**!` });
        } catch (err) {
            interaction.reply({ content: `\\❌ Unable to timeout **${member.user.username}**! [\`${err.name}\`]`, ephemeral: true });
        }
    }
};
