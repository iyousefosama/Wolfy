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

        const member = await guild.members.fetch(user.id).catch(() => null);

        if (!member) {
            return interaction.reply({ content: client.language.getString("USER_NOT_FOUND", interaction.guild.id), ephemeral: true });
        }

        const isSelf = member.id === interaction.user.id;
        const isBot = member.id === client.user.id;
        const isOwner = member.id === guild.ownerId;
        const isDeveloper = client.owners && client.owners.includes(member.id);
        const hasHigherRole = interaction.member.roles.highest.position <= member.roles.highest.position;

        if (isSelf) return interaction.reply({ content: client.language.getString("CANNOT_MODERATE_SELF", interaction.guild.id, { action: "TIMEOUT" }), ephemeral: true });
        if (isBot) return interaction.reply({ content: client.language.getString("CANNOT_MODERATE_BOT", interaction.guild.id, { action: "TIMEOUT" }), ephemeral: true });
        if (isOwner) return interaction.reply({ content: client.language.getString("CANNOT_MODERATE_OWNER", interaction.guild.id, { action: "TIMEOUT" }), ephemeral: true });
        if (isDeveloper) return interaction.reply({ content: client.language.getString("CANNOT_MODERATE_DEV", interaction.guild.id, { action: "TIMEOUT" }), ephemeral: true });
        if (hasHigherRole) return interaction.reply({ content: client.language.getString("CANNOT_MODERATE_HIGHER", interaction.guild.id, { action: "TIMEOUT" }), ephemeral: true });

        let timeoutDuration = ms(time);

        if (timeoutDuration === undefined && time !== "0") {
            return interaction.reply({ content: client.language.getString("NOT_VALID_TIME_INSEC", interaction.guild.id), ephemeral: true });
        }

        if (time === "0") {
            timeoutDuration = null;
        }

        try {
            if (timeoutDuration !== null) {
                await member.timeout(timeoutDuration, `Wolfy TIMEOUT: ${interaction.user.username}: ${reason}`);
                interaction.reply({ content: client.language.getString("MODERATE_SUCCESS", interaction.guild.id, { action_done: "TIMEOUT", target: member.user.username }) });
            } else {
                await member.timeout(null, `Wolfy TIMEOUT: ${interaction.user.username}: ${reason}`);
                interaction.reply({ content: client.language.getString("MODERATE_SUCCESS", interaction.guild.id, { action_done: "TIMEOUT_REMOVED", target: member.user.username }) });
            }
        } catch (err) {
            interaction.reply({ content: client.language.getString("CANNOT_MODERATE", interaction.guild.id, { action: "timeout" }), ephemeral: true });
        }
    }
};
