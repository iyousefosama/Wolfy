const ms = require('ms');
const { EmbedBuilder } = require("discord.js");
const { colors } = require("../../util/constants/constants");

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
            return interaction.reply({ content: "❌ | User could not be found! Please ensure the supplied ID is valid.", ephemeral: true });
        }

        const isSelf = member.id === interaction.user.id;
        const isBot = member.id === client.user.id;
        const isOwner = member.id === guild.ownerId;
        const isDeveloper = client.owners && client.owners.includes(member.id);
        const hasHigherRole = interaction.member.roles.highest.position <= member.roles.highest.position;

        if (isSelf) return interaction.reply({ content: "❌ | You cannot **timeout** yourself!", ephemeral: true });
        if (isBot) return interaction.reply({ content: "❌ | You cannot **timeout** me!", ephemeral: true });
        if (isOwner) return interaction.reply({ content: "❌ | You cannot **timeout** the server owner!", ephemeral: true });
        if (isDeveloper) return interaction.reply({ content: "❌ | You cannot **timeout** my developer through me!", ephemeral: true });
        if (hasHigherRole) return interaction.reply({ content: "❌ | You can't **timeout** that user because he/she has a higher role than yours!", ephemeral: true });

        let timeoutDuration = ms(time);

        if (timeoutDuration === undefined && time !== "0") {
            return interaction.reply({ content: "❌ | Please provide a valid time for the timeout!", ephemeral: true });
        }

        if (time === "0") {
            timeoutDuration = null;
        }

        try {
            if (timeoutDuration !== null) {
                await member.timeout(timeoutDuration, `Wolfy TIMEOUT: ${interaction.user.username}: ${reason}`);
                const embed = new EmbedBuilder()
                    .setColor(colors.ADMIN)
                    .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
                    .setDescription([
                        `Successfully **timed out** the user **${member.user.username}** for ${time}!`,
                        !reason ? '' : `- Reason: ${reason}`
                    ].join('\n'))
                    .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
                    .setTimestamp();
                return interaction.reply({ embeds: [embed] });
            } else {
                await member.timeout(null, `Wolfy TIMEOUT: ${interaction.user.username}: ${reason}`);
                const embed = new EmbedBuilder()
                    .setColor(colors.ADMIN)
                    .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
                    .setDescription([
                        `Successfully removed **timeout** for the user **${member.user.username}**!`,
                        !reason ? '' : `- Reason: ${reason}`
                    ].join('\n'))
                    .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
                    .setTimestamp();
                return interaction.reply({ embeds: [embed] });
            }
        } catch (err) {
            return interaction.reply({ content: "❌ | I couldn't **timeout** that user!", ephemeral: true });
        }
    }
};
