const discord = require('discord.js');

module.exports = {
    name: "rpc",
    aliases: ["RPC", "Rpc"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<option>',
    cooldown: 1, //seconds(s)
    guarded: false, //or false
    permissions: [""],
    clientpermissions: ["USE_EXTERNAL_EMOJIS"],
    async execute(client, message, args) {
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
}