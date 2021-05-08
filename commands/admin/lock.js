const discord = require('discord.js');

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return
    if(!message.member.hasPermission("MANAGE_CHANNELS"))
    var Messingperms = new discord.MessageEmbed()
      .setColor(`RED`)
      .setDescription(`<a:pp802:768864899543466006> You don't have permission to use that command.`)
      message.channel.send(Messingperms)
      if(!message.member.hasPermission("MANAGE_CHANNELS")) return;

    if(!message.guild.me.permissions.has("MANAGE_CHANNELS")) return message.channel.send('<a:pp297:768866022081036319> Please Check My Permission <a:pp297:768866022081036319>')

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