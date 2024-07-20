const discord = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const schema = require('../../schema/Panel-schema')
const TicketSchema = require('../../schema/Ticket-Schema')

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
    name: "ticket",
    aliases: [],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<categoryPanel-id>',
    group: 'Tickets',
    description: 'Open new ticket in the server',
    cooldown: 10, //seconds(s)
    guarded: false, //or false
    requiresDatabase: true,
    permissions: [],
    clientPermissions: ["ManageChannels"],
    examples: ['1263598857980477582'],

    async execute(client, message, args) {

        let data;
        try {
            data = await schema.findOne({
                Guild: message.guild.id,
                Category: args[0]
            })
            if (!data) {
                return message.channel.send({ content: `\\❌ **${message.member.displayName}**, I can't find the panel category please contact mod or use \`/panel create\` cmd` })
            }
        } catch (err) {
            console.log(err)
            message.channel.send({ content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}` })
        }

        // getting in the ticket category
        const category = message.guild.channels.cache.get(data.Category)

        // if there is no ticket category return
        if (!category) {
            return message.channel.send({ content: `\\❌ **${message.member.displayName}**, I can't find the tickets channel please contact mod or use \`/panel create\` cmd` })
        } else if (!data.Enabled) {
            return message.channel.send({ content: `\\❌ **${message.member.displayName}**, The **tickets** command is disabled in this server!` })
        } else {
            // Do nothing..
        }

        let TicketData;
        try {
            TicketData = await TicketSchema.findOne({
                guildId: message.guild.id,
                UserId: message.author.id,
                Category: category.id
            })
            if (!TicketData) {
                TicketData = await TicketSchema.create({
                    guildId: message.guild.id,
                    UserId: message.author.id,
                    Category: category.id
                })
            }
        } catch (err) {
            console.log(err)
            message.channel.send({ content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}` })
        }


        var userName = message.author.username;

        var userDiscriminator = message.author.discriminator;
        if (category.children.cache.has(TicketData.ChannelId)) {
            return message.channel.send({ content: "<a:pp681:774089750373597185> You already have a ticket!" })
        }

        // making the ticket channel
        message.guild.channels.create({
            name: userName.toLowerCase() + "-" + userDiscriminator,
            type: ChannelType.GUILD_TEXT,
            parent: category,
            permissionOverwrites: [
                {
                    id: message.guild.id,
                    deny: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: message.author.id,
                    allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.AttachFiles, PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.AddReactions, PermissionsBitField.Flags.ReadMessageHistory],
                },
            ],
        }).then(async (channel) => {
            message.react('758141943833690202').catch(() => message.channel.send(`<:Verify:841711383191879690> Successfully created ${channel} ticket!`))
            const button = new ButtonBuilder()
                .setLabel(`Close`)
                .setCustomId("btn_close")
                .setStyle('Secondary')
                .setEmoji("🔒");
            const row = new ActionRowBuilder()
                .addComponents(button);
            var ticketEmbed = new discord.EmbedBuilder()
                .setAuthor({ name: `Welcome in your ticket ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true, size: 2048 }) })
                .setDescription(`<:tag:813830683772059748> Send here your message or question!
                    
                    > <:Humans:853495153280155668> User: ${message.author}
                    > <:pp198:853494893439352842> UserID: \`${message.author.id}\``)
                .setTimestamp()
            channel.send({ content: `${message.author}`, embeds: [ticketEmbed], components: [row] }).then(async () => {
                TicketData.ChannelId = channel.id;
                TicketData.IsClosed = false;
                TicketData.OpenTimeStamp = Math.floor(Date.now() / 1000)
                await TicketData.save().catch((err) => message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}!`));
            })
        })
    }
}