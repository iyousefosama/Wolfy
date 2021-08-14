const discord = require('discord.js');
const djsGames = require('djs-games')

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    if (!message.guild.me.permissions.has("SEND_MESSAGES") || !message.guild.me.permissions.has("EMBED_LINKS") || !message.guild.me.permissions.has("USE_EXTERNAL_EMOJIS") || !message.guild.me.permissions.has("ADD_REACTIONS") || !message.guild.me.permissions.has("VIEW_CHANNEL") || !message.guild.me.permissions.has("ATTACH_FILES") || !message.guild.me.permissions.has("READ_MESSAGE_HISTORY") || !message.guild.me.permissions.has("READ_MESSAGE_HISTORY")) return;
    if(!message.guild.me.permissions.has('SEND_MESSAGES')) return;
    const guessTheNumber = new djsGames.GuessTheNumber()
    guessTheNumber.startGame(message)
}

    

module.exports.help = {
    name: "guess",
    aliases: ['Guess', 'guess-the-number']
}