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
              if(!args[0]) return message.channel.send(`<a:Wrong:812104211361693696> You need to type the message to send!`)

              try {
              if(message) return message.delete()
              message.channel.send(text)
              } catch(err) {
                const UnknownErr = new discord.MessageEmbed()
                .setColor(`RED`)
                .setDescription(`<a:pp802:768864899543466006> Error, please report this to on our support server!`)
                .setURL(`https://discord.gg/qYjus2rujb`)
                message.channel.send(UnknownErr)
              }
    }
}