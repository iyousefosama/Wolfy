const discord = require('discord.js');
const djsGames = require('djs-games')

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    const guessTheNumber = new djsGames.GuessTheNumber()
    guessTheNumber.startGame(message)
}

    

module.exports.help = {
    name: "guess",
    aliases: ['Guess', 'guess-the-number']
}