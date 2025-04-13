const { EmbedBuilder } = require("discord.js");
const { ErrorEmbed } = require("../../util/modules/embeds");
const ticketSchema = require("../../schema/Ticket-Schema");
const panelSchema = require("../../schema/Panel-schema");
const sourcebin = require('sourcebin_js');

/**
 * @type {import("../../util/types/baseComponent")}
 */
module.exports = {
    name: "btn_delete",
    enabled: true,
    async action(client, interaction, parts) {
        await interaction.deferUpdate();
        try {
            const ticket = await ticketSchema.findOne({
                guildId: interaction.guild.id,
                ChannelId: interaction.channel.id,
                Category: interaction.channel.parentId,
            });
            const panel = await panelSchema.findOne({
                Guild: interaction.guild.id,
                Category: interaction.channel.parentId
            });

            if (!ticket) {
                return interaction.channel.send(client.language.getString("TICKET_DATA_NOT_FOUND", interaction.guild.id));
            }

            if (!ticket.IsClosed) {
                return interaction.followUp({ 
                    embeds: [ErrorEmbed(client.language.getString("TICKET_DELETE_NOT_CLOSED", interaction.guild.id, { default: 'Ticket should be closed before it can be deleted' }))], 
                    ephemeral: true 
                });
            }

            await interaction.channel.send({ 
                embeds: [
                    ErrorEmbed(client.language.getString("TICKET_DELETE_COUNTDOWN", interaction.guild.id, { default: 'Ticket will be deleted in `5 seconds`!' }))
                    .setAuthor({ 
                        name: interaction.user.username, 
                        iconURL: interaction.user.displayAvatarURL({ dynamic: true }) 
                    })
                ] 
            });

            setTimeout(async () => {
                try {
                    if(!interaction.channel) return;
                    const messages = await interaction.channel?.messages.fetch();
                    const output = messages.reverse().map(m => `${new Date(m.createdAt).toLocaleString("en-US")} - ${m.author.tag}: ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`).join("\n");

                    const response = await sourcebin.create([
                        {
                            name: " ",
                            content: output,
                            languageId: "text",
                        },
                    ], {
                        title: client.language.getString("TICKET_TRANSCRIPT_TITLE", interaction.guild.id, { 
                            channel: interaction.channel.name,
                            default: `Chat transcript for ${interaction.channel.name}`
                        }),
                        description: " ",
                    });

                    const TicketUser = await interaction.guild.members.fetch(ticket.UserId).catch(() => null);

                    const fields = [
                        { 
                            name: client.language.getString("TICKET_TRANSCRIPT_LINK", interaction.guild.id, { default: "Ticket transcript" }), 
                            value: `[${client.language.getString("TICKET_TRANSCRIPT_VIEW", interaction.guild.id, { default: "View" })}](${response.url})`, 
                            inline: true 
                        },
                        { 
                            name: client.language.getString("TICKET_TRANSCRIPT_OPENED_BY", interaction.guild.id, { default: "Opened by" }), 
                            value: `${TicketUser.user.tag}`, 
                            inline: true 
                        },
                        { 
                            name: client.language.getString("TICKET_TRANSCRIPT_CLOSED_BY", interaction.guild.id, { default: "Closed by" }), 
                            value: `${interaction.user.tag}`, 
                            inline: true 
                        },
                        { 
                            name: client.language.getString("TICKET_TRANSCRIPT_OPENED_AT", interaction.guild.id, { default: "Opened At" }), 
                            value: `<t:${ticket.OpenTimeStamp}>`, 
                            inline: true 
                        }
                    ];

                    if (ticket.claimedBy) {
                        const mod = await interaction.guild.members.fetch(ticket.claimedBy).catch(() => null);
                        fields.push({ 
                            name: client.language.getString("TICKET_TRANSCRIPT_CLAIMED_BY", interaction.guild.id, { default: "Claimed by" }), 
                            value: `${mod.user.username}`, 
                            inline: true 
                        });
                    }

                    const closedEmbed = new EmbedBuilder()
                        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                        .setTitle(client.language.getString("TICKET_TRANSCRIPT_EMBED_TITLE", interaction.guild.id, { default: "Ticket Closed." }))
                        .setDescription(client.language.getString("TICKET_TRANSCRIPT_EMBED_DESC", interaction.guild.id, { 
                            channel: interaction.channel.name, 
                            guild: interaction.guild.name,
                            default: `<:Tag:836168214525509653> Ticket ${interaction.channel.name} at ${interaction.guild.name} has been closed!`
                        }))
                        .addFields(fields)
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                        .setColor("#2F3136");

                    await TicketUser.send({ embeds: [closedEmbed] }).catch(() => null);
                    panel.logs && (await client.channels.fetch(panel.logs).catch(() => null))?.send({ embeds: [closedEmbed] }).catch(() => null);

                    await ticketSchema.findOneAndDelete({ guildId: interaction.guild.id, ChannelId: interaction.channel.id, Category: interaction.channel.parentId });
                    await interaction.channel.delete();
                } catch (err) {
                    console.error(err);
                    interaction.followUp(client.language.getString("ERROR_EXEC", interaction.guild.id));
                }
            }, 5000);
        } catch (err) {
            console.error(err);
            interaction.followUp({ 
                content: client.language.getString("ERR_DB", interaction.guild.id, { error: err.name }) 
            });
        }
    },
};
