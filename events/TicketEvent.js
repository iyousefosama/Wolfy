const Discord = require('discord.js')
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const schema = require('../schema/GuildSchema')
const TicketSchema = require('../schema/Ticket-Schema')

module.exports = {
    name: 'interactionCreate',
    async execute(client, interaction) {
        if (interaction.isButton()) {
        if (interaction.customId === 'ticket') {
            let data;
            let TicketData;
            try{
                data = await schema.findOne({
                    GuildID: interaction.guild.id
                })
                TicketData = await TicketSchema.findOne({
                    guildId: interaction.guild.id,
                    UserId: interaction.user.id
                })
                if(!data) {
                data = await schema.create({
                    GuildID: interaction.guild.id
                })
                }
                if(!TicketData) {
                    TicketData = await TicketSchema.create({
                        guildId: interaction.guild.id,
                        UserId: interaction.user.id
                    })
                    }
            } catch(err) {
                console.log(err)
                interaction.channel.send({ content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`})
            }
    
    // getting in the ticket category
    const categoryID = interaction.guild.channels.cache.get(data.Mod.Tickets.channel)
    let Channel = client.channels.cache.get(TicketData.ChannelId)

    // if there is no ticket category return
    if(!categoryID) {
    return interaction.reply({ content: `\\❌ **${interaction.member.displayName}**, I can't find the tickets channel please contact mod or use \`w!setticketch\` cmd`, ephemeral: true})
    } else if(!data.Mod.Tickets.isEnabled) {
    return interaction.reply({ content: `\\❌ **${interaction.member.displayName}**, The **tickets** command is disabled in this server!`, ephemeral: true})
    } else {
    // Do nothing..
    }

    var userName = interaction.user.username;
    
    var userDiscriminator = interaction.user.discriminator;

    let TicketAvailable = false
    interaction.guild.channels.cache.forEach(channel => {
        
        if(Channel && channel.id == Channel.id){
            TicketAvailable = true
            return;
        }
    });

    if(TicketAvailable) return interaction.channel.send({ content: "<a:pp681:774089750373597185> You already have a ticket!"})

    interaction.guild.channels.create(userName.toLowerCase() + "-" + userDiscriminator, {
        type: 'GUILD_TEXT',
        parent: categoryID,
        permissionOverwrites: [
            {
                id: interaction.guild.id,
                deny: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
            },
            {
                id: interaction.user.id,
                allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'ATTACH_FILES', 'CONNECT', 'ADD_REACTIONS', 'READ_MESSAGE_HISTORY'],
            },
        ],
    }).then(async (channel) => {
                    interaction.reply({ content: `<:Verify:841711383191879690> Successfully created ${channel} ticket!`, ephemeral: true})
                    const button = new MessageButton()
                    .setLabel(`Close`)
                    .setCustomId("98418541981561")
                    .setStyle('SECONDARY')
                    .setEmoji("🔒");
                    const row = new MessageActionRow()
                    .addComponents(button);
                    var ticketEmbed = new Discord.MessageEmbed()
                    .setAuthor({ name: `Welcome in your ticket ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({dynamic: true, size: 2048}) })
                    .setDescription(`<:tag:813830683772059748> Send here your message or question!
                    
                    > <:Humans:853495153280155668> User: ${interaction.user}
                    > <:pp198:853494893439352842> UserID: \`${interaction.user.id}\``)
                    .setTimestamp()
                    channel.send({ content: `${interaction.user}`, embeds: [ticketEmbed], components: [row] })
                    TicketData.ChannelId = channel.id;
                    TicketData.IsClosed = false;
                    TicketData.OpenTimeStamp = Math.floor(Date.now());
                    await TicketData.save().catch((err) => message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}!`));
                })
            }
        }
    }
}