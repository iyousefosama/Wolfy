const discord = require('discord.js')
const { MessageButton, MessageActionRow } = require('discord-buttons');

module.exports = {
    name: "lockdown",
    aliases: ["Lockdown", "LOCKDOWN"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    cooldown: 260, //seconds(s)
    guarded: false, //or false
    permissions: ["MANAGE_CHANNELS", "ADMINISTRATOR"],
    clientpermissions: ["MANAGE_CHANNELS", "ADMINISTRATOR"],
    async execute(client, message, args) {

        const sure = new discord.MessageEmbed()
        .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({dynamic: true, size: 2048}))
        .setColor(`RED`)
        .setDescription(`<a:pp681:774089750373597185>  Hey, **${message.author.username}** you are about to lockdown all channel in this server are you sure?`)
        .setFooter(`${message.guild.name}`, message.guild.iconURL({dynamic: true}))
        .setTimestamp()
  let button = new MessageButton()
  .setStyle('red')
  .setLabel('yes') 
  .setID('1')
  const row = new MessageActionRow()
  .addComponents(button);
  const msg = await message.channel.send({embed : sure, components : row})

  const filter = async (button) => {
    if(button.id === '1'){
        if (button.clicker.id !== message.author.id) return button.reply.defer()
        message.guild.channels.cache.forEach(channel => {
            try {
                channel.updateOverwrite(message.guild.roles.cache.find(e => e.name.toLowerCase().trim() == "@everyone"), {
                    SEND_MESSAGES: false
                })
                var dn = new discord.MessageEmbed()
                .setDescription(`<a:pp989:853496185443319809> Successfully locked all the channels`)
                msg.edit({embed : dn, components : disable})
            }catch(e) {
                const err = new discord.MessageEmbed()
                .addFields(
                    { name: "<a:Wrong:812104211361693696> **I couldn't lock**", value: `${channel}`, inline:true },
                    )
                return message.channel.send(err)
            }
        })
        }
}
const collector = msg.createButtonCollector(filter, { time: 10000 }); 
collector.on('end', message => {
    button.setDisabled(true)
    const newrow = new MessageActionRow()
    .addComponents(button);
    msg.edit({embed : sure, components : newrow})
})
}
}