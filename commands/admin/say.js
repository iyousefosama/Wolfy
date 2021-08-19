const discord = require('discord.js');

module.exports = {
    name: "say",
    aliases: ["Say", "SAY"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<text>',
    cooldown: 20, //seconds(s)
    guarded: false, //or false
    permissions: ["MANAGE_MESSAGES", "ADMINISTRATOR"],
    clientpermissions: ["MANAGE_MESSAGES", "ADMINISTRATOR"],
    async execute(client, message, args) {

              let text = args.slice(0).join(" ")
              if (!text) return message.channel.send(`<a:Wrong:812104211361693696> You need to type the message to send!`)

              if (message) return message.delete().then(msg => {
                setTimeout(() => { 
                    msg.channel.send(text)
                 }, 1000)
                })
    }
}