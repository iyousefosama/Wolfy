const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, Collection } = require("discord.js");
const ticketSchema = require("../../schema/Ticket-Schema");


/**
 * @type {import("../../util/types/baseComponent")}
 */
module.exports = {
    name: "btn_close",
    enabled: true,
    async action(client, interaction, parts) {
        await interaction.deferUpdate();

        let ticket;
        try {
            ticket = await ticketSchema.findOne({
                guildId: interaction.guild.id,
                ChannelId: interaction.channel.id,
                Category: interaction.channel.parentId,
            });
        } catch (err) {
            console.error(err);
            return interaction.followUp({
                content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`,
                ephemeral: true,
            });
        }

        if (!ticket) {
            return interaction.followUp({
                content: `\\❌ I can't find this guild \`data\` in the database!`,
                ephemeral: true,
            });
        }

        if (ticket.IsClosed) {
            return interaction.followUp({
                content: `\\❌ This ticket is already closed!`,
                ephemeral: true,
            });
        }

        const Channel = interaction.guild.channels.cache.get(ticket.ChannelId);
        await Channel.permissionOverwrites.edit(ticket.UserId, {
            SendMessages: false,
            ViewChannel: false,
        });

        const button = new ButtonBuilder()
            .setLabel("Transcript")
            .setCustomId("btn_transcript")
            .setStyle("Secondary")
            .setEmoji("853495194863534081");

        const button2 = new ButtonBuilder()
            .setLabel("Re-Open")
            .setCustomId("btn_reopen")
            .setStyle("Primary")
            .setEmoji("🔓");

        const button3 = new ButtonBuilder()
            .setLabel("Delete")
            .setCustomId("btn_delete")
            .setStyle("Danger")
            .setEmoji("853496185443319809");

        const row = new ActionRowBuilder().addComponents(button, button2, button3);

        const ClosedEmbed = new EmbedBuilder()
            .setAuthor({
                name: `Closed by ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
            })
            .setColor("#2F3136")
            .setDescription("```Ticket panel control system```");

        ticket.IsClosed = true;
        try {
            await ticket.save();
            interaction.channel.send({ embeds: [ClosedEmbed], components: [row] });
        } catch (err) {
            console.error(err);
            interaction.followUp({
                content: `\`❌ [${err.name}]:\` Something went wrong, please try again later!`,
                ephemeral: true,
            });
        }
    },
};
