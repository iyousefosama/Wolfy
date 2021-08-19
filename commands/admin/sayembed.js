const discord = require('discord.js')

module.exports = {
    name: "embed",
    aliases: ["Sayembed", "SAYEMBED", "sayembed"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<color> <text>',
    cooldown: 20, //seconds(s)
    guarded: false, //or false
    permissions: ["MANAGE_MESSAGES", "ADMINISTRATOR"],
    clientpermissions: ["MANAGE_MESSAGES", "ADMINISTRATOR"],
    async execute(client, message, args) {
     
    let color = args[0] // Embed args color   
    let text = args.slice(1).join(" ")
    
    if(!args[0]) return message.channel.send(`<a:Wrong:812104211361693696> **I can't find the embed color**\n\`Ex: !embed {color} {Description} / !embed RED test\``)
    if(!args[1]) return message.channel.send(`<a:Wrong:812104211361693696> **I can't find the embed Description**\n\`Ex: !embed {color} {Description} / !embed RED test\``)

    const sayembed = new discord.MessageEmbed()
    .setColor(`${color}`)
    .setDescription(`${text}`)
    .setTimestamp()
    message.channel.send(sayembed)
    if (message.deleted) return;
   message.delete()
    .catch(err => {
        const UnknownErr = new discord.MessageEmbed()
        .setColor(`RED`)
        .setDescription(`<a:pp802:768864899543466006> Error, please report this with feedback command!`)
        message.channel.send(UnknownErr)
        console.error(err);
      })
}
}
