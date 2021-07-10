const discord = require('discord.js')

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(`w@`)) return;
    if(message.author.id !== '829819269806030879') return

    let time = args[0]
    if(!time) return message.channel.send("<a:pp802:768864899543466006> Please provide a time in seconds")
    if(isNaN(time)) return message.channel.send("<a:pp802:768864899543466006> Please provide a valid number")

    message.channel.setRateLimitPerUser(time, 'No Reason')

    message.channel.send(`Successfully set the slowmode on this channel ${time} seconds`)
    var dn = new discord.MessageEmbed()
    .setColor(`DARK_GREEN`)
    .setDescription(`<a:Correct:812104211386728498> Successfully set the slowmode on this channel ${time} seconds`)
    var msg = message.channel.send(dn)
}

module.exports.help = {
    name: 'slowmode',
    aliases: ['slowmo']
}