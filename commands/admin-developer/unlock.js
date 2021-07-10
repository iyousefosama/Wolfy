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
            SEND_MESSAGES:true
        })
        let unlock = new discord.MessageEmbed()
        .setColor(`GREEN`)
        .setDescription(`<a:pp399:768864799625838604> Unlocked @everyone from texting in this channel!`)
        msg.edit(unlock)
    
    }catch(e){
        message.channel.send(e)
    }
}



module.exports.help = {
    name: 'unlock',
    aliases: ['Unlock']
}