const ms = require('ms');
const { ApplicationCommandOptionType } = require("discord.js");
const { checkModerationTarget } = require("../../util/moderation/targetChecks");
const { buildActionEmbed } = require("../../util/moderation/embeds");

// Discord API limit: timeout can't exceed 28 days.
const MAX_TIMEOUT_MS = 28 * 24 * 60 * 60 * 1000;
const MIN_TIMEOUT_MS = 10_000;

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
                type: ApplicationCommandOptionType.User,
                name: 'target',
                description: 'The user to timeout',
                required: true
            },
            {
                type: ApplicationCommandOptionType.String,
                name: 'time',
                description: 'Duration (e.g. 30m, 2h, 1d) or type "0" to remove timeout',
                required: true
            },
            {
                type: ApplicationCommandOptionType.String,
                name: 'reason',
                description: 'The reason for the timeout',
                required: false
            }
        ]
    },
    async execute(client, interaction) {
        const { options } = interaction;
        const time = options.getString("time");
        const reason = options.getString("reason") || 'Unspecified';

        const check = await checkModerationTarget(client, interaction, 'timeout');
        if (!check.ok) {
            return interaction.reply({ content: check.content, flags: ['Ephemeral'] });
        }
        const { member } = check;

        // "0" removes an existing timeout
        if (time === "0") {
            try {
                await member.timeout(null, `Wolfy TIMEOUT: ${interaction.user.username}: ${reason}`);
                const embed = buildActionEmbed({
                    target: member,
                    executor: interaction.user,
                    description: [
                        `Successfully removed **timeout** for the user **${member.user.username}**!`,
                        reason ? `- Reason: ${reason}` : ''
                    ].join('\n'),
                });
                return interaction.reply({ embeds: [embed] });
            } catch {
                return interaction.reply({ content: "❌ | I couldn't remove the **timeout** for that user!", flags: ['Ephemeral'] });
            }
        }

        const durationMs = ms(time);
        if (!durationMs || durationMs < MIN_TIMEOUT_MS) {
            return interaction.reply({
                content: "❌ | Please provide a valid duration (minimum 10 seconds). Examples: `30m`, `2h`, `1d`.",
                flags: ['Ephemeral']
            });
        }
        if (durationMs > MAX_TIMEOUT_MS) {
            return interaction.reply({
                content: "❌ | Timeout cannot exceed **28 days**.",
                flags: ['Ephemeral']
            });
        }

        const expiresAt = Math.floor((Date.now() + durationMs) / 1000);

        try {
            await member.timeout(durationMs, `Wolfy TIMEOUT: ${interaction.user.username}: ${reason}`);
            const embed = buildActionEmbed({
                target: member,
                executor: interaction.user,
                description: [
                    `Successfully **timed out** the user **${member.user.username}** for ${time}.`,
                    reason ? `- Reason: ${reason}` : '',
                    `- Expires: <t:${expiresAt}:F> (<t:${expiresAt}:R>)`
                ].join('\n'),
            });
            return interaction.reply({ embeds: [embed] });
        } catch {
            return interaction.reply({ content: "❌ | I couldn't **timeout** that user!", flags: ['Ephemeral'] });
        }
    }
};