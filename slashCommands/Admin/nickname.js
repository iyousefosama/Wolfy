const { EmbedBuilder } = require('discord.js');
const { colors } = require('../../util/constants/constants');

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
            return interaction.reply({ content: "❌ User could not be found! Please ensure the supplied ID is valid.", flags: ['Ephemeral'] });
        } else if (member.id === client.user.id) {
            return interaction.reply({ content: "❌ You cannot change my nickname!", flags: ['Ephemeral'] });
        } else if (member.id === guild.ownerId) {
            return interaction.reply({ content: "❌ You cannot change the server owner's nickname!", flags: ['Ephemeral'] });
        } else if (client.owners.includes(member.id)) {
            return interaction.reply({ content: "❌ You cannot change my developer's nickname!", flags: ['Ephemeral'] });
        } else if (interaction.member.roles.highest.position <= member.roles.highest.position) {
            return interaction.reply({ content: "❌ You can't change the nickname for this user because they have a higher role!", flags: ['Ephemeral'] });
        };

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
        } catch (error) {
            return interaction.reply({ content: "❌ I couldn't change the nickname for this user!", flags: ['Ephemeral'] });
        }
    },
};
