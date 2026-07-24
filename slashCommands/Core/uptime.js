const discord = require('discord.js');
const { colors } = require('../../util/constants/constants');

module.exports = {
    data: {
        name: "uptime",
        description: "Replies with bot uptime!",
        dmOnly: false,
        guildOnly: false,
        cooldown: 0,
        group: "Bot",
        clientPermissions: [],
        permissions: [],
        options: [
            {
                type: 5, // BOOLEAN
                name: 'hide',
                description: 'Hide the output',
                required: false
            }
        ]
    },
    async execute(client, interaction) {
        const hide = interaction.options.getBoolean('hide');

        // Dynamic import of 'parse-ms'
        const ms = (await import('parse-ms')).default;

        let time = ms(client.uptime);
        var uptime = new discord.EmbedBuilder()
            .setColor(colors.BOT)
            .setDescription(`⏱️ **I have been online** \`${time.days}\` **days, \`${time.hours}\` hours, \`${time.minutes}\` minutes, \`${time.seconds}\` seconds**`)
            .setFooter({
                text: `Requested by ${interaction.user.username}`,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true })
            })
            .setTimestamp();
        var msg = interaction.reply({ embeds: [uptime], flags: hide ? ['Ephemeral'] : [] });
    },
};
