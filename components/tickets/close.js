const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const ticketSchema = require("../../schema/Ticket-Schema");
const { ErrorEmbed, SuccessEmbed } = require("../../util/modules/embeds");
const { colors } = require("../../util/constants/constants");

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
                guildId: interaction.guildId,
                ChannelId: interaction.channel.id,
                Category: interaction.channel.parentId,
            });
        } catch (err) {
            console.error(err);
            return interaction.followUp({
                content: `💢 [DATABASE_ERR]: The database responded with error: ${err.name}`,
                flags: ['Ephemeral'],
            });
        }

        if (!ticket) {
            return interaction.followUp({
                content: "💢 I can't find this guild `data` in the database!",
                flags: ['Ephemeral'],
            });
        }

        if (ticket.IsClosed) {
            return interaction.followUp({
                embeds: [ErrorEmbed("Ticket is already closed!")],
                flags: ['Ephemeral'],
            });
        }

        const Channel = interaction.guild.channels.cache.get(ticket.ChannelId);
 /*         const modsRole = interaction.guild.roles.cache.get(panel.ModRole);

        if (!interaction.member.roles.includes(modsRole.id) && !interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return interaction.followUp({ embeds: [ErrorEmbed("Only mods and admins can close tickets!")] })
        }; */

        if (!Channel) {
            return interaction.followUp({
                embeds: [ErrorEmbed("I can't find the channel associated with this ticket!")],
                flags: ['Ephemeral'],
            });
        }


        await Channel.permissionOverwrites.edit(ticket.UserId, {
            SendMessages: false,
            ViewChannel: false,
        });

        const button = new ButtonBuilder()
            .setLabel("Transcript")
            .setCustomId("btn_transcript")
            .setStyle("Secondary")
            .setEmoji("📄");

        const button2 = new ButtonBuilder()
            .setLabel("Re-Open")
            .setCustomId("btn_reopen")
            .setStyle("Primary")
            .setEmoji("🔓");

        const button3 = new ButtonBuilder()
            .setLabel("Delete")
            .setCustomId("btn_delete")
            .setStyle("Danger")
            .setEmoji("🗑️");

        const row = new ActionRowBuilder().addComponents(button, button2, button3);

        ticket.IsClosed = true;
        try {
            await ticket.save();
            interaction.channel.send({
                embeds: [new EmbedBuilder()
                    .setAuthor({
                        name: `Closed by ${interaction.user.tag}`,
                        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                    })
                    .setColor(colors.BOT)
                    .setDescription("```Ticket panel control system```")],
                components: [row]
            });
        } catch (err) {
            console.error(err);
            interaction.followUp({
                content: "💢 An error has occurred, please try again later.",
                flags: ['Ephemeral'],
            });
        }
    },
};
