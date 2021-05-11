const discord = require('discord.js');

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    if(message.author.bot) return;
    if (message.author != '821655420410003497') return
    message.delete({timeout: "1000"})
    message.channel.send('https://cdn.discordapp.com/attachments/750221561708937257/813831156067729449/Line.gif')
}

    

module.exports.help = {
    name: "line",
    aliases: ['Line']
}