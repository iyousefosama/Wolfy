const discord = require('discord.js');
const djsGames = require('djs-games')

module.exports = {
    name: "guess",
    aliases: ["Guess", "GuessTheNumber", "GUESS", "GuessNumber"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    cooldown: 10, //seconds(s)
    guarded: false, //or false
    permissions: [""],
    async execute(client, message, args) {
    if (!message.guild.me.permissions.has("SEND_MESSAGES") || !message.guild.me.permissions.has("EMBED_LINKS") || !message.guild.me.permissions.has("USE_EXTERNAL_EMOJIS") || !message.guild.me.permissions.has("ADD_REACTIONS") || !message.guild.me.permissions.has("VIEW_CHANNEL") || !message.guild.me.permissions.has("ATTACH_FILES") || !message.guild.me.permissions.has("READ_MESSAGE_HISTORY") || !message.guild.me.permissions.has("READ_MESSAGE_HISTORY")) return;
    if(!message.guild.me.permissions.has('SEND_MESSAGES')) return;
    const guessTheNumber = new djsGames.GuessTheNumber()
    guessTheNumber.startGame(message)
    }
}