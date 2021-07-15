const discord = require('discord.js')

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return
    const Messingperms = new discord.MessageEmbed()
    .setColor(`RED`)
    .setDescription(`<a:pp802:768864899543466006> You don't have permission to use that command.`)
    if(!message.member.hasPermission('BAN_MEMBERS', 'ADMINISTRATOR')) return message.channel.send(Messingperms)
    if(!message.member.guild.me.hasPermission("MANAGE_CHANNELS")) return message.channel.send("I dont have enough permissions")

    message.guild.channels.cache.forEach(channel => {
        try {
            channel.updateOverwrite(message.guild.roles.cache.find(e => e.name.toLowerCase().trim() == "@everyone"), {
                SEND_MESSAGES: false
            })
        }catch(e) {
            console.log(e)
            return message.channel.send(`I couldn't lock ${channel}`)
        }
    })

    var dn = new discord.MessageEmbed()
    .setDescription(`<a:pp989:853496185443319809> Successfully locked all the channels`)
    var msg = message.channel.send(dn)

}

module.exports.help = {
    name: 'lockdown',
    aliases: ['Lockdown']
}