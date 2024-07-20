const { EmbedBuilder } = require('discord.js');
const TicketSchema = require('../../schema/Ticket-Schema');
const sourcebin = require('sourcebin_js');
const { ErrorEmbed } = require("../../util/modules/embeds")

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
    name: "delete",
    aliases: [],
    dmOnly: false,
    guildOnly: true,
    args: false,
    usage: '',
    group: 'Tickets',
    description: 'Delete your ticket in the server',
    cooldown: 2,
    guarded: false,
    requiresDatabase: true,
    permissions: ["ManageChannels"],
    clientPermissions: ["ManageChannels"],
    examples: [],

    async execute(client, message, args) {
        let TicketData;
        try {
            TicketData = await TicketSchema.findOne({
                guildId: message.guild.id,
                ChannelId: message.channel.id,
                Category: message.channel.parentId
            });
        } catch (err) {
            console.log(err)
            message.channel.send({ content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}` })
        }

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

        await message.channel.send({ embeds: [ErrorEmbed('<a:pp681:774089750373597185> Ticket will be deleted in 5 seconds')] });

        setTimeout(async () => {
            try {
                const messages = await message.channel.messages.fetch();
                const output = messages.reverse().map(m => `${new Date(m.createdAt).toLocaleString('en-US')} - ${m.author.tag}: ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`).join('\n');

                const response = await sourcebin.create([
                    {
                        name: ' ',
                        content: output,
                        languageId: 'text',
                    },
                ], {
                    title: `Chat transcript for ${message.channel.name}`,
                    description: ' ',
                });

                const TicketUser = await message.guild.members.fetch(TicketData.UserId);
                const channel = message.channel;
                await TicketSchema.findOneAndDelete({ guildId: message.guild.id, ChannelId: channel.id, Category: message.channel.parentId });
                try {
                    await channel.delete();
                    await TicketUser.send({
                        embeds: [new EmbedBuilder()
                            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                            .setTitle("Ticket Closed.")
                            .setDescription(`<:Tag:836168214525509653> ${channel.name} Ticket at ${message.guild.name} has been closed!`)
                            .addFields(
                                { name: "Ticket transcript", value: `[View](${response.url})`, inline: true },
                                { name: "Opened by", value: `${TicketUser.user.tag}`, inline: true },
                                { name: "Closed by", value: `${message.author.tag}`, inline: true },
                                { name: "Opened At", value: `<t:${TicketData.OpenTimeStamp}>`, inline: true }
                            )
                            .setTimestamp()
                            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                            .setColor('#2F3136')]
                    })
                } catch {
                    return null;
                }
            } catch (err) {
                console.error(err);
                message.channel.send(`\\❌ [\`${err.name}\`]: An error occurred, please try again!`);
            }
        }, 5000);
    }
}
