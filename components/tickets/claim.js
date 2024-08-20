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
                embeds: [ErrorEmbed("Ticket can't be claimed because it's closed!")],
                ephemeral: true,
            });
        } else if (ticket.IsClaimed) {
            return interaction.followUp({
                embeds: [ErrorEmbed("Ticket is already claimed!")],
                ephemeral: true,
            })
        }

        const Channel = interaction.guild.channels.cache.get(ticket.ChannelId);
        const modsRole = interaction.guild.roles.cache.get(panel.ModRole);

        if (!Channel) {
            return interaction.followUp({
                embeds: [ErrorEmbed("I can't find the channel associated with this ticket!")],
                ephemeral: true,
            });
        }

        if (!modsRole) {
            return interaction.followUp({
                embeds: [ErrorEmbed("The panel \`mods-role\` is not set!")],
                ephemeral: true,
            });
        }

        if (!interaction.member.roles.cache.has(modsRole.id)) {
            return interaction.followUp({
                embeds: [ErrorEmbed(`You need to have ${modsRole} in order to claim this ticket!`)],
                ephemeral: true,
            });
        }

        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return interaction.followUp({
                content: `\\❌ I don't have permission to manage channels!`,
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
                }
            ]);

            ticket.IsClaimed = true;
            ticket.claimedBy = interaction.user.id;
            await ticket.save();
            interaction.channel.send({ embeds: [InfoEmbed(`${interaction.user} has claimed this ticket.`)] });
        } catch (err) {
            console.error(err);
            return interaction.followUp({
                content: `\`❌ [${err.name}]:\` Something went wrong, please try again later!`,
                ephemeral: true,
            });
        }
    },
};
