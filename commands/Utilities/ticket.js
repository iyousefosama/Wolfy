const discord = require('discord.js');
const { MessageActionRow, MessageButton } = require('discord.js');
const schema = require('../../schema/GuildSchema')
const TicketSchema = require('../../schema/Ticket-Schema')

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
        let TicketData;
        try{
            data = await schema.findOne({
                GuildID: message.guild.id
            })
            TicketData = await TicketSchema.findOne({
                guildId: message.guild.id,
                UserId: message.author.id
            })
            if(!data) {
            data = await schema.create({
                GuildID: message.guild.id
            })
            }
            if(!TicketData) {
                TicketData = await TicketSchema.create({
                    guildId: message.guild.id,
                    UserId: message.author.id
                })
                }
        } catch(err) {
            console.log(err)
            message.channel.send({ content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`})
        }

    // getting in the ticket category
    const categoryID = message.guild.channels.cache.get(data.Mod.Tickets.channel)
    let Channel = client.channels.cache.get(TicketData.ChannelId)

    // if there is no ticket category return
    if(!categoryID) {
    return message.channel.send({ content: `\\❌ **${message.member.displayName}**, I can't find the tickets channel please contact mod or use \`w!setticketch\` cmd`})
    } else if(!data.Mod.Tickets.isEnabled) {
    return message.channel.send({ content: `\\❌ **${message.member.displayName}**, The **tickets** command is disabled in this server!`})
    } else {
    // Do nothing..
    }

    var userName = message.author.username;
    
    var userDiscriminator = message.author.discriminator;
    let TicketAvailable = false
    message.guild.channels.cache.forEach(channel => {
        
        if(Channel && channel.id == Channel.id){
            TicketAvailable = true
            return;
        }
    });

    if(TicketAvailable) return message.channel.send({ content: "<a:pp681:774089750373597185> You already have a ticket!"})

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
                    const button = new MessageButton()
                    .setLabel(`Close`)
                    .setCustomId("98418541981561")
                    .setStyle('SECONDARY')
                    .setEmoji("🔒");
                    const row = new MessageActionRow()
                    .addComponents(button);
                    var ticketEmbed = new discord.MessageEmbed()
                    .setAuthor({ name: `Welcome in your ticket ${message.author.tag}`, iconURL: message.author.displayAvatarURL({dynamic: true, size: 2048}) })
                    .setDescription(`<:tag:813830683772059748> Send here your message or question!
                    
                    > <:Humans:853495153280155668> User: ${message.author}
                    > <:pp198:853494893439352842> UserID: \`${message.author.id}\``)
                    .setTimestamp()
                    channel.send({ content: `${message.author}`, embeds: [ticketEmbed], components: [row] }).then(async () => {
                        TicketData.ChannelId = channel.id;
                        TicketData.IsClosed = false;
                        await TicketData.save().catch((err) => message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}!`));
                    })
                })
    }
}