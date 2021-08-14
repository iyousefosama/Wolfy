const discord = require('discord.js');
const cooldown = new Set();

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    if(cooldown.has(message.author.id)) {
        message.reply('Please wait \`5 seconds\` between using the command, because you are on cooldown')
    } else {
    // if the member don't have this perm return by sending this msg
    if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('You dont have the perms for the nuke command')
    if(!message.guild.me.permissions.has('ADMINISTRATOR')) return message.channel.send('You dont have the perms for the nuke command')
    // getting the channel's id that is gonna be nuked
    var channel = Client.channels.cache.get(message.channel.id)

    // getting the position of the channel by the category
    var posisi = channel.position

    if(!channel) return;
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
    .catch(err => {
        const UnknownErr = new discord.MessageEmbed()
        .setColor(`RED`)
        .setDescription(`<a:pp802:768864899543466006> Error, please report this to on our support server!`)
        .setURL(`https://discord.gg/qYjus2rujb`)
        message.channel.send(UnknownErr)
        console.error(err)
      })
    setTimeout(() => {
        cooldown.delete(message.author.id)
    }, 5000); // here will be the time in miliseconds 5 seconds = 5000 miliseconds
    }
}
    


module.exports.help = {
    name: `nuke`,
    aliases: ['destroy', 'Nuke']
}