const discord = require('discord.js')
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: "lockdown",
    aliases: ["Lockdown", "LOCKDOWN"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    group: 'Moderation',
    description: 'It lock all channels for @everyone from talking',
    cooldown: 660, //seconds(s)
    guarded: false, //or false
    permissions: ["MANAGE_CHANNELS", "ADMINISTRATOR"],
    clientpermissions: ["MANAGE_CHANNELS", "ADMINISTRATOR"],
    examples: [''],
    async execute(client, message, args) {

        const sure = new discord.MessageEmbed()
        .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({dynamic: true, size: 2048}))
        .setColor(`RED`)
        .setDescription(`<a:pp681:774089750373597185>  Hey, **${message.author.username}** you are about to lockdown all channel in this server are you sure?`)
        .setFooter(`${message.guild.name}`, message.guild.iconURL({dynamic: true}))
        .setTimestamp()
        let button = new MessageButton()
        .setStyle('DANGER')
        .setLabel('yes') 
        .setCustomId('1')
        const row = new MessageActionRow()
        .addComponents(button);

        const msg = await message.channel.send({ embeds: [sure], components: [row]})
        const collector = msg.createMessageComponentCollector({ time: 15000 });

    collector.on('collect', async interactionCreate => {
        if(interactionCreate.customId === '1'){
            if (interactionCreate.member.id !== message.author.id) return interactionCreate.deferUpdate()
            message.guild.channels.cache.forEach(channel => {
                try {
                    channel.permissionOverwrites.edit(message.guild.roles.cache.find(e => e.name.toLowerCase().trim() == "@everyone"), {
                        SEND_MESSAGES: false
                    })
                    var dn = new discord.MessageEmbed()
                    .setDescription(`<a:pp989:853496185443319809> Successfully locked all the channels`)
                    msg.edit({embeds: [dn], components: [disable]})
                }catch(e) {
                    const err = new discord.MessageEmbed()
                    .setDescription(`<a:Wrong:812104211361693696> I couldn't lock ${channel}!`)
                    message.channel.send({ embeds: [err] })
                }
            })
            }
})
    collector.on('end', message => {
        button.setDisabled(true)
        const newrow = new MessageActionRow()
        .addComponents(button);
        msg.edit({embeds: [sure], components: [newrow]})
    })
}
}