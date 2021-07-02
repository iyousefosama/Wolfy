const discord = require('discord.js')

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return

    let time = args[0]
    if(!time) return message.channel.send("<a:pp802:768864899543466006> Please provide a time in seconds")
    if(isNaN(time)) return message.channel.send("<a:pp802:768864899543466006> Please provide a valid number")

    message.channel.setRateLimitPerUser(time, 'No Reason')

    message.channel.send(`Successfully set the slowmode on this channel ${time} seconds`)
    .catch(err => {
        message.reply('<a:Error:836169051310260265> Unknown Error, report this for bot developer!');
        console.error(err);
      });
}

module.exports.help = {
    name: 'slowmode',
    aliases: ['slowmo']
}