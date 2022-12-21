const discord = require('discord.js')

module.exports = {
    name: "embed",
    aliases: ["Sayembed", "SAYEMBED", "sayembed"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<color> <text>',
    group: 'Moderation',
    description: 'The bot will repeat what you say with embed',
    cooldown: 20, //seconds(s)
    guarded: false, //or false
    permissions: ["MANAGE_MESSAGES"],
    clientpermissions: ["MANAGE_MESSAGES"],
    examples: [
      'GREEN Hello, this is an example embed',
      '#d8bfd8 Hello, this is an example embed'
    ],
    async execute(client, message, args) {
     
    let color = args[0] // Embed args color   
    let text = args.slice(1).join(" ")
    if(!color) {
    color = "RED";
    }
    
    if(!args[0]) return message.channel.send({ content: `<a:Wrong:812104211361693696> **I can't find the embed color**\n\`Ex: !embed {color} {Description} / !embed RED test\``})
    if(!args[1]) return message.channel.send({ content: `<a:Wrong:812104211361693696> **I can't find the embed Description**\n\`Ex: !embed {color} {Description} / !embed RED test\``})

    const sayembed = new discord.MessageEmbed()
    .setColor(color)
    .setDescription(text)
    .setTimestamp()
    message.channel.send({ embeds: [sayembed] })
    message.delete().catch(() => null)
}
}
