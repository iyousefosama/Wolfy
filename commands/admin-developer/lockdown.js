const discord = require('discord.js')

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(`w@`)) return;
    if(message.author.id !== '829819269806030879') return
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