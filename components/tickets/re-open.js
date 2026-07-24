const discord = require("discord.js");
const TicketSchema = require("../../schema/Ticket-Schema");
const { ErrorEmbed } = require("../../util/modules/embeds");
const { colors } = require("../../util/constants/constants");

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
                guildId: interaction.guildId,
                ChannelId: interaction.channel.id,
                Category: interaction.channel.parentId,
            });
        } catch (err) {
            console.log(err);
            interaction.followUp({
                content: `💢 [DATABASE_ERR]: The database responded with error: ${err.name}`,
                ephemeral: true
            });
        }
        if (!ticket) {
            return interaction.channel.send("💢 I can't find this guild `data` in the database!");
        }

        if (!ticket.IsClosed) {
            return interaction.followUp({ 
                embeds: [ErrorEmbed("Ticket is already open!")], 
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
                            `Re-opened by ${interaction.user.tag}`
                        )
                        .setFooter({
                            text: client.user.username,
                            iconURL: client.user.displayAvatarURL({ dynamic: true }),
                        })
                        .setColor(colors.SUCCESS)]
                });
            })
            .catch(() => {
                interaction.channel.send({
                    content: "💢 An error has occurred, please try again later.",
                });
            });
    },
};
