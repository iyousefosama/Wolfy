const Discord = require('discord.js')
const { MessageEmbed} = require('discord.js')
const schema = require('../schema/GuildSchema')

module.exports = {
    name: 'interactionCreate',
    async execute(client, interaction) {
        if (interaction.isButton()) {
        if (interaction.customId === 'ticket') {
        let data;
        try{
            data = await schema.findOne({
                GuildID: interaction.guild.id
            })
            if(!data) {
            data = await schema.create({
                GuildID: interaction.guild.id
            })
            }
        } catch(err) {
            console.log(err)
            interaction.reply({ content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`, ephemeral: true})
        }

    // getting in the ticket category
    const categoryID = interaction.guild.channels.cache.get(data.Mod.Tickets.channel)

    // if there is no ticket category return
    if(!categoryID) {
    return interaction.reply({ content: `\\❌ **${interaction.member.displayName}**, I can't find the tickets channel please contact mod or use \`w!setticketch\` cmd`, ephemeral: true})
    } else if(!data.Mod.Tickets.isEnabled) {
    return interaction.reply({ content: `\\❌ **${message.member.displayName}**, The **tickets** command is disabled in this server!`, ephemeral: true})
    } else {
    // Do nothing..
    }

    // getting the username of the member who created the ticket
    var userName = interaction.user.username;
    
    // getting the Discriminator (KarimX#9586) of the ticket creator
    var userDiscriminator = interaction.user.discriminator;

    // making the var for the funtion
    var ticketexist = false;

    // getting all the channels in the server
    interaction.guild.channels.cache.forEach(channel => {
        
        // making sure that the user dont already have a ticket
        if(channel.name == userName.toLowerCase() + "-" + userDiscriminator){
        
            // setting it to true so there is already a ticket
            ticketexist = true;

            // returning the cmd
            return;
        }
    });

    // if the user already have a ticket return ( dont create another ticket for him)
    if(ticketexist) return interaction.reply({ content: "<a:pp681:774089750373597185> You already have a ticket!", ephemeral: true})
    // making the ticket channel
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
                    var ticketEmbed = new Discord.MessageEmbed()
                    .setTitle(`Welcome in your ticket ${interaction.user.username}`)
                    .setDescription(`<:tag:813830683772059748>Send here your message or question!
                    
                    User: <@${interaction.user.id}>
                    UserID: ${interaction.user.id}`)
                    .setTimestamp()
                    channel.send({ content: `<@${interaction.user.id}>`, embeds: [ticketEmbed] })
                })
            }
        }
    }
}