const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const { colors } = require('../../util/constants/constants');
const { checkModerationTarget } = require('../../util/moderation/targetChecks');

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
                type: ApplicationCommandOptionType.String,
                name: 'nickname',
                description: 'The new nickname',
                required: false
            },
            {
                type: ApplicationCommandOptionType.User,
                name: 'target',
                description: 'A user to change nickname for',
                required: false
            }
        ]
    },
    async execute(client, interaction) {
        const { options } = interaction;
        const nickname = options.getString("nickname");

        const targetUser = options.getUser("target");
        const targetId = targetUser?.id ?? interaction.user.id;
        const member = await interaction.guild.members.fetch(targetId).catch(() => null);

        const check = await checkModerationTarget(client, interaction, 'nickname', { member });
        if (!check.ok) {
            return interaction.reply({ content: check.content, flags: ['Ephemeral'] });
        }

        try {
            if (!nickname) {
                await member.setNickname(null, `Wolfy Nickname: ${interaction.user.username}`);
                const embed = new EmbedBuilder()
                    .setColor(colors.ADMIN)
                    .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
                    .setDescription(`Successfully reset the nickname for **${member.user.username}**!`)
                    .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
                    .setTimestamp();
                return interaction.reply({ embeds: [embed] });
            }

            await member.setNickname(nickname, `Wolfy Nickname: ${interaction.user.username}`);
            const embed = new EmbedBuilder()
                .setColor(colors.ADMIN)
                .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
                .setDescription([
                    `Successfully changed **${member.user.username}**'s nickname to **${nickname}**!`,
                ].join('\n'))
                .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
                .setTimestamp();
            return interaction.reply({ embeds: [embed] });
        } catch {
            return interaction.reply({ content: "❌ I couldn't change the nickname for this user!", flags: ['Ephemeral'] });
        }
    },
};
