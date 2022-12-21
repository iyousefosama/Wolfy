const discord = require('discord.js');

module.exports = {
    name: "say",
    aliases: ["Say", "SAY"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<text>',
    group: 'Moderation',
    description: 'The bot will repeat what you say',
    cooldown: 20, //seconds(s)
    guarded: false, //or false
    permissions: ["MANAGE_MESSAGES"],
    clientpermissions: ["MANAGE_MESSAGES"],
    examples: [
        'Hello everyone how are you?'
      ],
    async execute(client, message, args) {

              let text = args.slice(0).join(" ")
              if (!text) return message.channel.send({ content: `<a:Wrong:812104211361693696> You need to type the message to send!`})

              message.delete().catch(() => null).then(msg => {
                setTimeout(() => { 
                    msg.channel.send({ content: text })
                 }, 100)
                })
    }
}