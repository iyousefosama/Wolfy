const discord = require("discord.js");
const {
    ActionRowBuilder,
    ButtonBuilder,
    PermissionsBitField,
    ChannelType,
} = require("discord.js");
const schema = require("../../schema/Panel-schema");
const TicketSchema = require("../../schema/Ticket-Schema");
const { ErrorEmbed, SuccessEmbed } = require("../../util/modules/embeds");

/**
 * @type {import("../../util/types/baseComponent")}
 */
module.exports = {
    name: "btn_ticket",
    enabled: true,
    async action(client, interaction, parts) {
        await interaction.deferUpdate();

        let data;
        try {
            data = await schema.findOne({
                Guild: interaction.guildId,
                Category: parts[2]
            });
            if (!data) {
                return interaction.followUp({
                    content: client.language.getString("DATA_404", interaction.guildId, { data: "category" }),
                    ephemeral: true,
                });
            }
        } catch (err) {
            interaction.followUp({
                content: client.language.getString("ERR_DB", interaction.guildId, { error: err.name }),
                ephemeral: true,
            });
            return client.logDetailedError({
                error: err,
                eventType: "btn_ticket",
                interaction: interaction
            });
        }

        const category = interaction.guild.channels.cache.get(data.Category);

        if (!category) {
            return interaction.followUp({
                embeds: [ErrorEmbed(client.language.getString("DATA_404", interaction.guildId, { data: "Category" }))],
                ephemeral: true,
            });
        } else if (!data.Enabled) {
            return interaction.followUp({
                embeds: [ErrorEmbed(client.language.getString("CMD_BLOCKED", interaction.guildId, { commandName: "ticket" }))],
                ephemeral: true,
            });
        }

        let TicketData;
        try {
            TicketData = await TicketSchema.findOne({
                guildId: interaction.guildId,
                UserId: interaction.user.id,
                Category: category.id
            });
            if (!TicketData) {
                TicketData = await TicketSchema.create({
                    guildId: interaction.guildId,
                    UserId: interaction.user.id,
                    Category: category.id
                });
            }
        } catch (err) {
            console.log(err);
            return interaction.channel.send({
                content: client.language.getString("ERR_DB", interaction.guildId, { error: err.name }),
            });
        }

        if (category.children.cache.has(TicketData.ChannelId)) {
            return interaction.followUp({
                embeds: [ErrorEmbed(client.language.getString("TICKET_ALREADY_OPEN", interaction.guildId))],
                ephemeral: true,
            });
        }

        const modsRole = interaction.guild.roles.cache.get(data.ModRole);

        const permissionOverwrites = [
            {
                id: interaction.guildId,
                deny: [
                    PermissionsBitField.Flags.SendMessages,
                    PermissionsBitField.Flags.ViewChannel,
                ],
            },
            {
                id: interaction.user.id,
                allow: [
                    PermissionsBitField.Flags.SendMessages,
                    PermissionsBitField.Flags.ViewChannel,
                    PermissionsBitField.Flags.AttachFiles,
                    PermissionsBitField.Flags.Connect,
                    PermissionsBitField.Flags.AddReactions,
                    PermissionsBitField.Flags.ReadMessageHistory,
                ],
            }
        ];

        if (modsRole) {
            permissionOverwrites.push({
                id: modsRole.id,
                allow: [
                    PermissionsBitField.Flags.SendMessages,
                    PermissionsBitField.Flags.ViewChannel,
                    PermissionsBitField.Flags.AttachFiles,
                    PermissionsBitField.Flags.Connect,
                    PermissionsBitField.Flags.AddReactions,
                    PermissionsBitField.Flags.ReadMessageHistory,
                ],
            });
        }

        interaction.guild.channels.create({
            name: `${interaction.user.username.toLowerCase()}`,
            type: ChannelType.GuildText,
            parent: category,
            permissionOverwrites,
        })
            .then(async (channel) => {
                interaction.followUp({
                    embeds: [SuccessEmbed(client.language.getString("TICKET_OPEN_SUCCESS", interaction.guildId))],
                    ephemeral: true,
                });

                const close = new ButtonBuilder()
                    .setLabel(client.language.getString("TICKET_BUTTON_CLOSE", interaction.guildId, { default: "Close" }))
                    .setCustomId("btn_close")
                    .setStyle("Secondary")
                    .setEmoji("🔒");

                const claim = new ButtonBuilder()
                    .setLabel(client.language.getString("TICKET_BUTTON_CLAIM", interaction.guildId))
                    .setCustomId("btn_claim")
                    .setStyle("Success");

                const row = new ActionRowBuilder().addComponents(close, claim);

                const ticketEmbed = new discord.EmbedBuilder()
                    .setAuthor({
                        name: client.language.getString("TICKET_WELCOME_TITLE", interaction.guildId, { 
                            user: interaction.user.tag,
                            default: `Welcome in your ticket ${interaction.user.tag}`
                        }),
                        iconURL: interaction.user.displayAvatarURL({
                            dynamic: true,
                            size: 2048,
                        }),
                    })
                    .setDescription(data.Message ? data.Message.replace(/{user}/g, `${interaction.user}`) : [
                        `<:tag:813830683772059748> ${client.language.getString("TICKET_WELCOME_DESCRIPTION", interaction.guildId, { default: "Send here your message or question!" })}\n`,
                        `> <:Humans:853495153280155668> ${client.language.getString("TICKET_WELCOME_USER", interaction.guildId, { default: "User" })}: ${interaction.user}`,
                        `> <:pp198:853494893439352842> ${client.language.getString("TICKET_WELCOME_USERID", interaction.guildId, { default: "UserID" })}: \`${interaction.user.id}\``,
                    ].join("\n"))
                    .setTimestamp();

                channel.send({
                    content: `${interaction.user} ${modsRole ? `(${modsRole})` : ""}`,
                    embeds: [ticketEmbed],
                    components: [row],
                });

                TicketData.ChannelId = channel.id;
                TicketData.IsClosed = false;
                TicketData.OpenTimeStamp = Math.floor(Date.now() / 1000);
                await TicketData.save().catch((err) =>
                    channel.send(
                        client.language.getString("ERR_DB", interaction.guildId, { error: err.name })
                    )
                );
            });
    },
};
