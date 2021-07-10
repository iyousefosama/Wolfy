const discord = require('discord.js');

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(`w@`)) return;
    if(message.author.id !== '829819269806030879') return

    // getting the channel's id that is gonna be nuked
    var channel = Client.channels.cache.get(message.channel.id)

    // getting the position of the channel by the category
    var posisi = channel.position

   // clonning the channel
    channel.clone().then((channel2) => {
        
        // sets the position of the new channel
        channel2.setPosition(posisi)

        // deleting the nuked channel
        channel.delete()

        // sending a msg in the new channel
    let nuke = new discord.MessageEmbed()
    .setColor(`RED`)
    .setDescription(`<a:Error:836169051310260265> Channel nuked by **${message.author.username}**`)
    channel2.send(nuke)
    })
}
    


module.exports.help = {
    name: `nuke`,
    aliases: ['destroy', 'Nuke']
}