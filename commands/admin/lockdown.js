const discord = require('discord.js')
const { MessageButton, MessageActionRow } = require('discord-buttons');

module.exports = {
    name: "mute",
    aliases: ["Mute", "MUTE"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    cooldown: 260, //seconds(s)
    guarded: false, //or false
    permissions: ["MANAGE_CHANNELS", "ADMINISTRATOR"],
    clientpermissions: ["MANAGE_CHANNELS", "ADMINISTRATOR"],
    async execute(client, message, args) {

    let button = new MessageButton()
  .setStyle('red')
  .setLabel('yes') 
  .setID('sure');
message.channel.send(sure, button).then(message => {
    setTimeout(() => {
        message.delete()
    }, 5000);
})

client.on('clickButton', async (button) => {
    
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
}
}