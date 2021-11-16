const discord = require('discord.js');
const { MessageActionRow, MessageButton } = require('discord.js');
const schema = require('../../schema/GuildSchema')

module.exports = {
    name: "ticket",
    aliases: ["Ticket"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    group: 'ticket',
    description: 'Open new ticket in the server',
    cooldown: 30, //seconds(s)
    guarded: false, //or false
    clientpermissions: ["MANAGE_CHANNELS"],
    examples: [''],
    async execute(client, message, args) {

        let data;
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

    // getting the username of the member who created the ticket
    var userName = message.author.username;
    
    // getting the Discriminator (KarimX#9586) of the ticket creator
    var userDiscriminator = message.author.discriminator;

    // making the var for the funtion
    var ticketexist = false;

    // getting all the channels in the server
    message.guild.channels.cache.forEach(channel => {
        
        // making sure that the user dont already have a ticket
        if(channel.name == userName.toLowerCase() + "-" + userDiscriminator){
        
            // setting it to true so there is already a ticket
            ticketexist = true;

            // returning the cmd
            return;
        }
    });

    // if the user already have a ticket return ( dont create another ticket for him)
    if(ticketexist) return message.channel.send({ content: "<a:pp681:774089750373597185> You already have a ticket!"})
    // making the ticket channel
    message.guild.channels.create(userName.toLowerCase() + "-" + userDiscriminator, {
        type: 'GUILD_TEXT',
        parent: categoryID,
        permissionOverwrites: [
            {
                id: message.guild.id,
                deny: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
            },
            {
                id: message.author.id,
                allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'ATTACH_FILES', 'CONNECT', 'ADD_REACTIONS', 'READ_MESSAGE_HISTORY'],
            },
        ],
    }).then(async (channel) => {
                    message.react('758141943833690202').catch(() => message.channel.send(`<:Verify:841711383191879690> Successfully created ${channel} ticket!`))
                    var ticketEmbed = new discord.MessageEmbed()
                    .setTitle(`Welcome in your ticket ${message.author.username}`)
                    .setDescription(`<:tag:813830683772059748>Send here your message or question!
                    
                    User: <@${message.author.id}>
                    UserID: ${message.author.id}`)
                    .setTimestamp()
                    channel.send({ content: `<@${message.author.id}>`, embeds: [ticketEmbed] })
                })
    }
}