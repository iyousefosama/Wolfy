const discord = require('discord.js')
const cooldown = new Set();

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    if (message.channel.type === "dm") return;
    if(cooldown.has(message.author.id)) {
        message.reply('Please wait \`3 seconds\` between using the command, because you are on cooldown')
    } else {
        const Messingperms = new discord.MessageEmbed()
        .setColor(`RED`)
        .setDescription(`<a:pp802:768864899543466006> You don't have permission to use that command.`)
        if(!message.member.hasPermission('MANAGE_MESSAGES', 'ADMINISTRATOR')) return message.channel.send(Messingperms)
        if(!message.guild.me.permissions.has('MANAGE_MESSAGES', 'ADMINISTRATOR')) return;
     
    let color = args[0] // Embed args color   
    let text = args.slice(1).join(" ")
    
    if(!args[0]) return message.channel.send(`<a:Wrong:812104211361693696> **I can't find the embed color**\n\`Ex: !embed {color} {Description} / !embed RED test\``)
    if(!args[1]) return message.channel.send(`<a:Wrong:812104211361693696> **I can't find the embed Description**\n\`Ex: !embed {color} {Description} / !embed RED test\``)

    const sayembed = new discord.MessageEmbed()
    .setColor(`${color}`)
    .setDescription(`${text}`)
    .setTimestamp()
    message.channel.send(sayembed)
    message.delete()
    .catch(err => {
        const UnknownErr = new discord.MessageEmbed()
        .setColor(`RED`)
        .setDescription(`<a:pp802:768864899543466006> Error, please report this to on our support server!`)
        .setURL(`https://discord.gg/qYjus2rujb`)
        message.channel.send(UnknownErr)
        console.error(err);
      })
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