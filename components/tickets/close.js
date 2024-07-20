const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, Collection } = require("discord.js");
const TicketSchema = require("../../schema/Ticket-Schema");

/**
 * @type {import("../../util/types/baseComponent")}
 */
module.exports = {
    name: "btn_close",
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
                content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`,
                ephemeral: true,
            });
        }

        if (!TicketData) {
            return interaction.followUp({
                content: `\\❌ I can't find this guild \`data\` in the database!`,
                ephemeral: true,
            });
        }

        if (TicketData.IsClosed) {
            return interaction.followUp({
                content: `\\❌ This ticket is already closed!`,
                ephemeral: true,
            });
        }

        const Channel = interaction.guild.channels.cache.get(TicketData.ChannelId);
        await Channel.permissionOverwrites.edit(TicketData.UserId, {
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

        TicketData.IsClosed = true;
        try {
            await TicketData.save();
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
