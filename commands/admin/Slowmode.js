const discord = require('discord.js')

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return
    if (message.channel.type === "dm") return;
    const Messingperms = new discord.MessageEmbed()
    .setColor(`RED`)
    .setDescription(`<a:pp802:768864899543466006> You don't have permission to use that command.`)
    if(!message.member.hasPermission('MANAGE_CHANNELS')) return message.channel.send(Messingperms)

    let time = args[0]
    if(!time) return message.channel.send("<a:pp802:768864899543466006> Please provide a time in seconds")
    if(isNaN(time)) return message.channel.send("<a:pp802:768864899543466006> Please provide a valid number")

    message.channel.setRateLimitPerUser(time, 'No Reason')

    var dn = new discord.MessageEmbed()
    .setColor(`DARK_GREEN`)
    .setDescription(`<a:Correct:812104211386728498> Successfully set the slowmode on this channel ${time} seconds`)
    var msg = message.channel.send(dn)
    .catch(err => {
        const UnknownErr = new discord.MessageEmbed()
        .setColor(`RED`)
        .setDescription(`<a:pp802:768864899543466006> Error, please report this to on our support server!`)
        .setURL(`https://discord.gg/qYjus2rujb`)
        message.channel.send(UnknownErr)
        console.error(err);
      })
}

module.exports.help = {
    name: 'slowmode',
    aliases: ['slowmo']
}
