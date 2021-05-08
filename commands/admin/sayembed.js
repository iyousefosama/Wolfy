const discord = require('discord.js')
const cooldown = new Set();

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    if(cooldown.has(message.author.id)) {
        message.reply('Please wait \`3 seconds\` between using the command, because you are on cooldown')
    } else {
        if (!message.member.hasPermission("ADMINISTRATOR"))
        var Messingperms = new discord.MessageEmbed()
    .setColor(`RED`)
    .setDescription(`<a:pp802:768864899543466006> You don't have permission to use that command.`)
    message.channel.send(Messingperms)
    if (!message.member.hasPermission("ADMINISTRATOR")) return;
     
    if (!message.member.hasPermission("ADMINISTRATOR")) return
    let color = args[0] // Embed args color 
    if (!message.member.hasPermission("ADMINISTRATOR")) return   
    let text = args.slice(1).join(" ")
    
    if(!args[0]) return message.channel.send(`<a:Wrong:812104211361693696> **I can't find the embed color**\n\`Ex: !embed {color} {Description} / !embed RED test\``)
    if(!args[1]) return message.channel.send(`<a:Wrong:812104211361693696> **I can't find the embed Description**\n\`Ex: !embed {color} {Description} / !embed RED test\``)

    const sayembed = new discord.MessageEmbed()
    .setColor(`${color}`)
    .setDescription(`${text}`)
    .setTimestamp()
    message.channel.send(sayembed)
    message.delete()

    cooldown.add(message.author.id);
    setTimeout(() => {
        cooldown.delete(message.author.id)
    }, 3000); // here will be the time in miliseconds 5 seconds = 5000 miliseconds
}
}


module.exports.help = {
    name: "embed",
    aliases: ['sayembed', 'Embed', 'Sayembed']
}