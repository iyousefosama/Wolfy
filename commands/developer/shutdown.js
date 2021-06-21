const discord = require('discord.js');

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    if (message.author != '829819269806030879') return

    var  loading = new discord.MessageEmbed()
    .setColor(`RED`)
    .setDescription(`<a:Loading_Color:759734580122484757> Shutting down now...`)
    var msg = await message.channel.send(loading)
  
    process.exit()
    

}

    

module.exports.help = {
    name: "shutdown",
    aliases: ['Shutdown']
}