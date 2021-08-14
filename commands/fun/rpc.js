const discord = require('discord.js');

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    if (!message.guild.me.permissions.has("SEND_MESSAGES") || !message.guild.me.permissions.has("EMBED_LINKS") || !message.guild.me.permissions.has("USE_EXTERNAL_EMOJIS") || !message.guild.me.permissions.has("ADD_REACTIONS") || !message.guild.me.permissions.has("VIEW_CHANNEL") || !message.guild.me.permissions.has("ATTACH_FILES") || !message.guild.me.permissions.has("READ_MESSAGE_HISTORY") || !message.guild.me.permissions.has("READ_MESSAGE_HISTORY")) return;
    const messageArray = message.content.split(' ');
    const arg2 = messageArray.slice(1);;
    let search = arg2.slice(0).join(' ');

    if (!search) return message.channel.send(`You must send a valid option! \`i.e\`**Rock, Paper, Scissors.**`)

    const options = [
        "rock 🪨",
        "paper <:paper:814667582116331530>",
        "scissors :scissors: "
    ]
    const option = options[Math.floor(Math.random() * options.length)]
    if (search === 'rock') {
        message.channel.send(`My choice was ${option}!`)
    }else if (search === 'paper') {
        message.channel.send(`My choice was ${option}!`)
            }else if (search === 'scissors') {
        message.channel.send(`My choice was ${option}!`)
    }else {
        message.channel.send(`**"${search}**" is not a valid Option! You must send a valid option! \`i.e\`**Rock, Paper, Scissors.**`)
    }

}

    

module.exports.help = {
    name: "rpc",
    aliases: ['Rpc']
}