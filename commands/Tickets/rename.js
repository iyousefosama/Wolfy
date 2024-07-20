const { EmbedBuilder } = require('discord.js');
const TicketSchema = require('../../schema/Ticket-Schema');
const { SuccessEmbed, ErrorEmbed } = require("../../util/modules/embeds")
/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
    name: "rename",
    aliases: [],
    dmOnly: false,
    guildOnly: true,
    args: true,
    usage: '<Name>',
    group: 'Tickets',
    description: 'Change ticket name',
    cooldown: 2,
    guarded: false,
    requiresDatabase: true,
    permissions: ["ManageChannels"],
    clientPermissions: ["ManageChannels"],
    examples: [
        'Test-ticket'
    ],

    async execute(client, message, args) {
        const name = args.join(" ");

        try {
            const TicketData = await TicketSchema.findOne({
                guildId: message.guild.id,
                ChannelId: message.channel.id,
                Category: message.channel.parentId
            });

            if (!TicketData) {
                return message.channel.send({ content: `\\❌ **${message.author.username}**, this is not a valid ticket channel!` });
            }

            const category = message.guild.channels.cache.get(data.Category);
            if (!category) {
                return message.channel.send({ content: `\\❌ **${message.member.displayName}**, can't find the tickets channel. Contact mod or use \`w!setticketch\`` });
            }
            if (message.channel.parentId !== category.id) {
                return message.channel.send({ content: `\\❌ **${message.member.displayName}**, use this cmd only in the ticket channel!` });
            }

            return message.channel.setName(name)
            .then(() => message.channel.send({ embeds: [SuccessEmbed('<a:pp399:768864799625838604> Ticket name changed')] }))
            .catch(() => message.channel.send({ embeds: [ErrorEmbed('💢 Unable to change channel name.')] }))
            
        } catch (err) {
            console.error(err);
            message.channel.send({ content: `\`❌ [${err.name}]:\` There was an error trying while renaming the ticket.` });
        }
    }
};
