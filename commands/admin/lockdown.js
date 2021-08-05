const discord = require('discord.js')
const { MessageButton, MessageActionRow } = require('discord-buttons');
const cooldown = new Set();

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return
    if (message.channel.type === "dm") return;
    if(cooldown.has(message.author.id)) {
        message.reply('Please wait \`5 seconds\` between using the command, because you are on cooldown')
    } else {
    const Messingperms = new discord.MessageEmbed()
    .setColor(`RED`)
    .setDescription(`<a:pp802:768864899543466006> You don't have permission to use that command.`)
    const sure = new discord.MessageEmbed()
    .setColor(`RED`)
    .setDescription(`Are you sure you want to lockdown all channels in this server?`)
    if(!message.member.hasPermission('MANAGE_CHANNELS', 'ADMINISTRATOR')) return message.channel.send(Messingperms)
    if(!message.member.guild.me.hasPermission("MANAGE_CHANNELS")) return message.channel.send("I dont have enough permissions")
    let button = new MessageButton()
  .setStyle('red')
  .setLabel('yes') 
  .setID('sure');
message.channel.send(sure, button).then(message => {
    setTimeout(() => {
        message.delete()
    }, 5000);
})


Client.on('clickButton', async (button) => {
    await button.reply.think()
    message.guild.channels.cache.forEach(channel => {
        try {
            channel.updateOverwrite(message.guild.roles.cache.find(e => e.name.toLowerCase().trim() == "@everyone"), {
                SEND_MESSAGES: false
            })
        }catch(e) {
            console.log(e)
            return message.channel.send(`I couldn't lock ${channel}`)
        }
    })

    var dn = new discord.MessageEmbed()
    .setDescription(`<a:pp989:853496185443319809> Successfully locked all the channels`)
    button.reply.edit(dn)
});
setTimeout(() => {
    cooldown.delete(message.author.id)
}, 5000); // here will be the time in miliseconds 5 seconds = 5000 miliseconds
}
}

module.exports.help = {
    name: 'lockdown',
    aliases: ['Lockdown']
}