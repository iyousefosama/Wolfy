const { PermissionsBitField } = require("discord.js");
const ticketSchema = require("../../schema/Ticket-Schema");
const panelSchema = require("../../schema/Panel-schema")
const { InfoEmbed, ErrorEmbed } = require("../../util/modules/embeds");

/**
 * @type {import("../../util/types/baseComponent")}
 */
module.exports = {
    name: "btn_claim",
    enabled: true,
    async action(client, interaction, parts) {
        await interaction.deferUpdate();

        let ticket;
        let panel;
        try {
            ticket = await ticketSchema.findOne({
                guildId: interaction.guild.id,
                ChannelId: interaction.channel.id,
                Category: interaction.channel.parentId,
            });
            panel = await panelSchema.findOne({
                Guild: interaction.guild.id,
                Category: interaction.channel.parentId
            })
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
                embeds: [ErrorEmbed(client.language.getString("TICKET_CLAIM_CLOSED", interaction.guild.id, { default: "Ticket can't be claimed because it's closed!" }))],
                ephemeral: true,
            });
        } else if (ticket.IsClaimed) {
            return interaction.followUp({
                embeds: [ErrorEmbed(client.language.getString("TICKET_ALREADY_CLAIMED", interaction.guild.id, { default: "Ticket is already claimed!" }))],
                ephemeral: true,
            })
        }

        const Channel = interaction.guild.channels.cache.get(ticket.ChannelId);
        const modsRole = interaction.guild.roles.cache.get(panel.ModRole);

        if (!Channel) {
            return interaction.followUp({
                embeds: [ErrorEmbed(client.language.getString("TICKET_CHANNEL_NOT_FOUND", interaction.guild.id))],
                ephemeral: true,
            });
        }

        if (!modsRole) {
            return interaction.followUp({
                embeds: [ErrorEmbed(client.language.getString("TICKET_MODROLE_NOT_SET", interaction.guild.id, { default: "The panel \`mods-role\` is not set!" }))],
                ephemeral: true,
            });
        }

        if (!interaction.member.roles.cache.has(modsRole.id)) {
            return interaction.followUp({
                embeds: [ErrorEmbed(client.language.getString("TICKET_MODROLE_REQUIRED", interaction.guild.id, { role: modsRole.toString(), default: `You need to have ${modsRole} in order to claim this ticket!` }))],
                ephemeral: true,
            });
        }

        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return interaction.followUp({
                content: client.language.getString("BOT_PERMS_REQ", interaction.guild.id, { permissions: "ManageChannels" }),
                ephemeral: true,
            });
        }

        try {
            await Channel.permissionOverwrites.set([
                {
                    id: interaction.guild.id,
                    deny: [
                        PermissionsBitField.Flags.SendMessages,
                        PermissionsBitField.Flags.ViewChannel,
                    ],
                },
                {
                    id: modsRole.id,
                    deny: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: interaction.user.id,
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                },
                {
                    id: ticket.UserId,
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                },
            ]);

            ticket.IsClaimed = true;
            ticket.claimedBy = interaction.user.id;
            await ticket.save();
            interaction.channel.send({ 
                embeds: [InfoEmbed(client.language.getString("TICKET_CLAIMED_BY", interaction.guild.id, { user: interaction.user.toString() }))] 
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
