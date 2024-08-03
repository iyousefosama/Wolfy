const discord = require('discord.js');

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
            .setColor(`DarkGreen`)
            .setDescription(`<a:pp399:768864799625838604> **I have been online for \`${time.days}\` days, \`${time.hours}\` hours, \`${time.minutes}\` minutes, \`${time.seconds}\` seconds**`);
        var msg = interaction.reply({ embeds: [uptime], ephemeral: hide });
    },
};
