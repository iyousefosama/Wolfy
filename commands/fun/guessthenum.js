const discord = require('discord.js');
const djsGames = require('djs-games')

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    if(!message.member.guild.me.hasPermission([SEND_MESSAGES, EMBED_LINKS, USE_EXTERNAL_EMOJIS])) return;
    if(!message.guild.me.permissions.has('SEND_MESSAGES')) return;
    const guessTheNumber = new djsGames.GuessTheNumber()
    guessTheNumber.startGame(message)
}

    

module.exports.help = {
    name: "guess",
    aliases: ['Guess', 'guess-the-number']
}