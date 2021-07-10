const discord = require('discord.js');

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(`w@`)) return;
    if(message.author.id !== '829819269806030879') return
    if (message.channel.type === "dm") return;
    if(!message.guild.me.permissions.has('MANAGE_CHANNELS', 'ADMINISTRATOR')) return;
        var  loading = new discord.MessageEmbed()
        .setColor(`YELLOW`)
        .setDescription(`<a:Loading_Color:759734580122484757> Loading...`)
        var msg = await message.channel.send(loading)

    try {
        message.channel.updateOverwrite(message.guild.roles.cache.find(e => e.name.toLowerCase().trim() == "@everyone"),{
            SEND_MESSAGES:false
        })
        let lock = new discord.MessageEmbed()
        .setColor(`RED`)
        .setDescription(`<a:pp802:768864899543466006> Locked @everyone from texting in this channel!`)
        msg.edit(lock)

    }catch(e){
        message.channel.send(e)
    }
    }
    



module.exports.help = {
    name: 'lock',
    aliases: ['Lock']
}