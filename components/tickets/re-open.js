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
                content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`,
            });
        }
        if (!ticket) {
            return interaction.channel.send(`\\❌ I can't find this ticket \`data\` in the database!`);
        }

        if (!ticket.IsClosed) {
            return interaction.followUp({ embeds: [ErrorEmbed("Ticket is already open!")], ephemeral: true });
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
                            `<:Verify:841711383191879690> Successfully re-opened the ticket by \`${interaction.user.tag}\`!`
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
                    content: `\`❌ [ERR]:\` Something is wrong, please try again later!`,
                });
            });
    },
};
