const discord = require('discord.js')
const ms = require('parse-ms');



module.exports.run = async (Client, message, args, prefix) => { 
    if(!message.content.startsWith(prefix)) return; 
    if(!message.member.guild.me.hasPermission(["SEND_MESSAGES", "EMBED_LINKS", "USE_EXTERNAL_EMOJIS"])) return;
    let time = ms(Client.uptime);
    var uptime = new discord.MessageEmbed()
        .setColor(`DARK_GREEN`)
        .setDescription(`<a:pp399:768864799625838604> **I have been online for \`${time.days}\` days, \`${time.hours}\` hours, \`${time.minutes}\` minutes, \`${time.seconds}\` seconds**`)
        var msg = message.channel.send(uptime)
}


module.exports.help = {
    name: "uptime",
    aliases: ['up-time']
}