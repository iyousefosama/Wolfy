const discord = require("discord.js");
const TicketSchema = require("../../schema/Ticket-Schema");
const { ErrorEmbed } = require("../../util/modules/embeds");

/**
 * @type {import("../../util/types/baseComponent")}
 */
module.exports = {
    name: "btn_reopen",
    enabled: true,
    async action(client, interaction, parts) {
        await interaction.deferUpdate();

        let ticket;
        try {
            ticket = await TicketSchema.findOne({
                guildId: interaction.guild.id,
                ChannelId: interaction.channel.id,
                Category: interaction.channel.parentId,
            });
        } catch (err) {
            console.log(err);
            interaction.followUp({
                content: client.language.getString("ERR_DB", interaction.guild.id, { error: err.name }),
                ephemeral: true
            });
        }
        if (!ticket) {
            return interaction.channel.send(client.language.getString("TICKET_DATA_NOT_FOUND", interaction.guild.id));
        }

        if (!ticket.IsClosed) {
            return interaction.followUp({ 
                embeds: [ErrorEmbed(client.language.getString("TICKET_ALREADY_OPEN", interaction.guild.id))], 
                ephemeral: true 
            });
        }
        const Channel = interaction.guild.channels.cache.get(ticket.ChannelId);

        Channel.permissionOverwrites.edit(ticket.UserId, {
            SendMessages: true,
            ViewChannel: true,
        });

        ticket.IsClosed = false;
        await ticket.save()
            .then(() => {
                interaction.channel.send({
                    embeds: [new discord.EmbedBuilder()
                        .setAuthor({
                            name: interaction.user.tag,
                            iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                        })
                        .setDescription(
                            client.language.getString("TICKET_REOPENED_BY", interaction.guild.id, {
                                user: interaction.user.tag
                            })
                        )
                        .setFooter({
                            text: client.user.username,
                            iconURL: client.user.displayAvatarURL({ dynamic: true }),
                        })
                        .setColor("Green")]
                });
            })
            .catch(() => {
                interaction.channel.send({
                    content: client.language.getString("ERROR", interaction.guild.id),
                });
            });
    },
};
