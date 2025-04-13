const { EmbedBuilder } = require("discord.js");
const sourcebin = require("sourcebin_js");
const TicketSchema = require("../../schema/Ticket-Schema");
const { InfoEmbed, ErrorEmbed } = require("../../util/modules/embeds");

/**
 * @type {import("../../util/types/baseComponent")}
 */
module.exports = {
    name: "btn_transcript",
    enabled: true,
    async action(client, interaction, parts) {
        await interaction.deferUpdate();

        let TicketData;
        try {
            TicketData = await TicketSchema.findOne({
                guildId: interaction.guild.id,
                ChannelId: interaction.channel.id,
                Category: interaction.channel.parentId,
            });
        } catch (err) {
            console.error(err);
            return interaction.followUp({
                content: client.language.getString("ERR_DB", interaction.guild.id, { error: err.name }),
            });
        }

        if (!TicketData || !TicketData.IsClosed) {
            return interaction.followUp({
                embeds: [ErrorEmbed(client.language.getString("TICKET_TRANSCRIPT_NOT_CLOSED", interaction.guild.id, { default: "This ticket is not closed!" }))],
                ephemeral: true,
            });
        }

        try {
            const messages = await interaction.channel.messages.fetch();
            const output = messages
                .reverse()
                .map(m => `${new Date(m.createdAt).toLocaleString("en-US")} - ${m.author.tag}: ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`)
                .join("\n");

            let response;
            try {
                response = await sourcebin.create([
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
            } catch (e) {
                console.error(e);
                return interaction.followUp({
                    content: client.language.getString("ERROR", interaction.guild.id),
                    ephemeral: true,
                });
            }

            const TicketUser = await client.users.fetch(TicketData.UserId);

            const embed = new EmbedBuilder()
                .setAuthor({
                    name: interaction.guild.name,
                    iconURL: interaction.guild.iconURL({ dynamic: true }),
                })
                .setTitle(client.language.getString("TICKET_TRANSCRIPT_LOGS_TITLE", interaction.guild.id, { default: "Ticket Logs." }))
                .setDescription(client.language.getString("TICKET_TRANSCRIPT_LOGS_DESC", interaction.guild.id, {
                    channel: interaction.channel.name,
                    guild: interaction.guild.name,
                    default: `<:Tag:836168214525509653> ${interaction.channel.name} Ticket at ${interaction.guild.name}!`
                }))
                .addFields(
                    { 
                        name: client.language.getString("TICKET_TRANSCRIPT_LINK", interaction.guild.id, { default: "Ticket transcript" }), 
                        value: `[${client.language.getString("TICKET_TRANSCRIPT_VIEW", interaction.guild.id, { default: "View" })}](${response.url})`, 
                        inline: true 
                    },
                    { 
                        name: client.language.getString("TICKET_TRANSCRIPT_OPENED_BY", interaction.guild.id, { default: "Opened by" }), 
                        value: `${TicketUser.tag}`, 
                        inline: true 
                    },
                    { 
                        name: client.language.getString("TICKET_TRANSCRIPT_OPENED_AT", interaction.guild.id, { default: "Opened At" }), 
                        value: `<t:${TicketData.OpenTimeStamp}>`, 
                        inline: true 
                    }
                )
                .setTimestamp()
                .setFooter({
                    text: client.user.username,
                    iconURL: client.user.displayAvatarURL({ dynamic: true }),
                })
                .setColor("738ADB");

                await interaction.user.send({ embeds: [embed] })
                .then(() => {
                    return interaction.followUp({
                        embeds: [InfoEmbed(client.language.getString("TICKET_TRANSCRIPT_SENT", interaction.guild.id, { default: "Sent transcript to your DM!" }))],
                        ephemeral: true,
                    });
                })
                .catch(() => {
                    return interaction.followUp({
                        embeds: [ErrorEmbed(client.language.getString("TICKET_TRANSCRIPT_DM_FAILED", interaction.guild.id, { default: "💢 I couldn't send the transcript to your **DM**!" }))],
                        ephemeral: true,
                    });
                });
            
        } catch (err) {
            console.error(err);
            return interaction.followUp({
                content: client.language.getString("ERROR_EXEC", interaction.guild.id),
                ephemeral: true,
            });
        }
    },
};
