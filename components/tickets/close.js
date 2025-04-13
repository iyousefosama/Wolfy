const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const ticketSchema = require("../../schema/Ticket-Schema");
const { ErrorEmbed, SuccessEmbed } = require("../../util/modules/embeds");

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
                content: client.language.getString("ERR_DB", interaction.guild.id, { error: err.name }),
                ephemeral: true,
            });
        }

        if (!ticket) {
            return interaction.followUp({
                content: client.language.getString("TICKET_DATA_NOT_FOUND", interaction.guild.id),
                ephemeral: true,
            });
        }

        if (ticket.IsClosed) {
            return interaction.followUp({
                embeds: [ErrorEmbed(client.language.getString("TICKET_ALREADY_CLOSED", interaction.guild.id))],
                ephemeral: true,
            });
        }

        const Channel = interaction.guild.channels.cache.get(ticket.ChannelId);
/*         const modsRole = interaction.guild.roles.cache.get(panel.ModRole);

        if (!interaction.member.roles.includes(modsRole.id) && !interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return interaction.followUp({ embeds: [ErrorEmbed("Only mods and admins can close tickets!")] })
        }; */

        if (!Channel) {
            return interaction.followUp({
                embeds: [ErrorEmbed(client.language.getString("TICKET_CHANNEL_NOT_FOUND", interaction.guild.id))],
                ephemeral: true,
            });
        }


        await Channel.permissionOverwrites.edit(ticket.UserId, {
            SendMessages: false,
            ViewChannel: false,
        });

        const button = new ButtonBuilder()
            .setLabel(client.language.getString("TICKET_BUTTON_TRANSCRIPT", interaction.guild.id))
            .setCustomId("btn_transcript")
            .setStyle("Secondary")
            .setEmoji("853495194863534081");

        const button2 = new ButtonBuilder()
            .setLabel(client.language.getString("TICKET_BUTTON_REOPEN", interaction.guild.id))
            .setCustomId("btn_reopen")
            .setStyle("Primary")
            .setEmoji("🔓");

        const button3 = new ButtonBuilder()
            .setLabel(client.language.getString("TICKET_BUTTON_DELETE", interaction.guild.id))
            .setCustomId("btn_delete")
            .setStyle("Danger")
            .setEmoji("853496185443319809");

        const row = new ActionRowBuilder().addComponents(button, button2, button3);

        ticket.IsClosed = true;
        try {
            await ticket.save();
            interaction.channel.send({
                embeds: [new EmbedBuilder()
                    .setAuthor({
                        name: client.language.getString("TICKET_CLOSED_BY", interaction.guild.id, {
                            user: interaction.user.tag
                        }),
                        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                    })
                    .setColor("#2F3136")
                    .setDescription(client.language.getString("TICKET_CONTROL_DESCRIPTION", interaction.guild.id))],
                components: [row]
            });
        } catch (err) {
            console.error(err);
            interaction.followUp({
                content: client.language.getString("ERROR", interaction.guild.id),
                ephemeral: true,
            });
        }
    },
};
