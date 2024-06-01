const discord = require('discord.js')
const ms = require('parse-ms');

module.exports = {
    name: "uptime",
    aliases: ["Uptime", "UPTIME"],
    dmOnly: false, //or false
    guildOnly: false, //or false
    args: false, //or false
    usage: '',
    group: 'bot',
    description: 'Show the bot uptime',
    cooldown: 15, //seconds(s)
    guarded: false, //or false
    permissions: [],
    clientPermissions: [discord.PermissionsBitField.Flags.UseExternalEmojis],
    examples: [''],
    async execute(client, message, args) {
    let time = ms(client.uptime);
    var uptime = new discord.EmbedBuilder()
        .setColor(`DarkGreen`)
        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({dynamic: true, size: 2048}) })
        .setDescription(`<a:pp399:768864799625838604> **I have been online for \`${time.days}\` days, \`${time.hours}\` hours, \`${time.minutes}\` minutes, \`${time.seconds}\` seconds**`)
        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({dynamic: true, size: 2048}) })
        .setTimestamp()
        message.channel.send({ embeds: [uptime] })
    }
}