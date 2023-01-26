const discord= require('discord.js');
const schema = require('../../schema/GuildSchema')
const TicketSchema = require('../../schema/Ticket-Schema')
const moment = require('moment');

module.exports = {
    name: "delete",
    aliases: ["Delete", "DELETE"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    group: 'Utilities',
    description: 'Delete your ticket in the server',
    cooldown: 1, //seconds(s)
    guarded: false, //or false
    permissions: [discord.PermissionsBitField.Flags.ManageChannels],
    clientpermissions: [discord.PermissionsBitField.Flags.ManageChannels],
    examples: [''],
    async execute(client, message, args) {

    let data;
    let TicketData;
    try{
        data = await schema.findOne({
            GuildID: message.guild.id
        })
        if(!data) {
        data = await schema.create({
            GuildID: message.guild.id
        })
        }
    } catch(err) {
        console.log(err)
        message.channel.send({ content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`})
    }

// getting in the ticket category
const categoryID = message.guild.channels.cache.get(data.Mod.Tickets.channel)

// if there is no ticket category return
if(!categoryID) {
return message.channel.send({ content: `\\❌ **${message.member.displayName}**, I can't find the tickets channel please contact mod or use \`w!setticketch\` cmd`})
} else if(!data.Mod.Tickets.isEnabled) {
    return message.channel.send({ content: `\\❌ **${message.member.displayName}**, The **tickets** command is disabled in this server!`})
} else {
// Do nothing..
}

    // if the channel is a ticket then...
    if(message.channel.parent == categoryID){
    
        // deletes the ticket / channel
        const close = new discord.EmbedBuilder()
        .setColor(`Red`)
        .setDescription('<a:pp681:774089750373597185> Ticket will be deleted in 5 seconds')
        message.channel.send({ embeds: [close]})
        .then(channel => {
            setTimeout(async () => {
                await message.channel.delete().catch(() => null)
            }, 5000);
        })

    // if its not a ticket channel return
    } else {
        return message.channel.send({ content: `\\❌ **${message.member.displayName}**, You can use this cmd only in the ticket!`})
    }
    }
}
