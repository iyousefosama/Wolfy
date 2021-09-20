const discord = require('discord.js')
const ms = require('parse-ms');



module.exports = {
    name: "uptime",
    aliases: ["Uptime", "UPTIME"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    group: 'bot',
    description: 'Show the bot uptime',
    cooldown: 15, //seconds(s)
    guarded: false, //or false
    clientpermissions: ["USE_EXTERNAL_EMOJIS"],
    examples: [''],
    async execute(client, message, args) {
    let time = ms(client.uptime);
    var uptime = new discord.MessageEmbed()
        .setColor(`DARK_GREEN`)
        .setDescription(`<a:pp399:768864799625838604> **I have been online for \`${time.days}\` days, \`${time.hours}\` hours, \`${time.minutes}\` minutes, \`${time.seconds}\` seconds**`)
        var msg = message.channel.send({ embeds: [uptime] })
    }
}