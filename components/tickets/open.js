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
                Guild: interaction.guild.id,
                Category: parts[2]
            });
            if (!data) {
                return interaction.followUp({
                    content: `\\❌ I can't find this category in my database!`,
                    ephemeral: true,
                });
            }
        } catch (err) {
            interaction.followUp({
                content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`,
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
                embeds: [ErrorEmbed("Category not found!")],
                ephemeral: true,
            });
        } else if (!data.Enabled) {
            return interaction.followUp({
                embeds: [ErrorEmbed("This category is not enabled!")],
                ephemeral: true,
            });
        }

        let TicketData;
        try {
            TicketData = await TicketSchema.findOne({
                guildId: interaction.guild.id,
                UserId: interaction.user.id,
                Category: category.id
            });
            if (!TicketData) {
                TicketData = await TicketSchema.create({
                    guildId: interaction.guild.id,
                    UserId: interaction.user.id,
                    Category: category.id
                });
            }
        } catch (err) {
            console.log(err);
            return interaction.channel.send({
                content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`,
            });
        }

        if (category.children.cache.has(TicketData.ChannelId)) {
            return interaction.followUp({
                embeds: [ErrorEmbed("Ticket is already open in this category!")],
                ephemeral: true,
            });
        }

        const modsRole = interaction.guild.roles.cache.get(data.ModRole);

        const permissionOverwrites = [
            {
                id: interaction.guild.id,
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
                    embeds: [SuccessEmbed(`<:Checkmark:1267279269638180935> Ticket created in ${channel}`)],
                    ephemeral: true,
                });

                const close = new ButtonBuilder()
                    .setLabel(`Close`)
                    .setCustomId("btn_close")
                    .setStyle("Secondary")
                    .setEmoji("🔒");

                const claim = new ButtonBuilder()
                    .setLabel(`Claim`)
                    .setCustomId("btn_claim")
                    .setStyle("Success");

                const row = new ActionRowBuilder().addComponents(close, claim);

                const ticketEmbed = new discord.EmbedBuilder()
                    .setAuthor({
                        name: `Welcome in your ticket ${interaction.user.tag}`,
                        iconURL: interaction.user.displayAvatarURL({
                            dynamic: true,
                            size: 2048,
                        }),
                    })
                    .setDescription(data.Message ? data.Message.replace(/{user}/g, `${interaction.user}`) : [
                        `<:tag:813830683772059748> Send here your message or question!\n`,
                        `> <:Humans:853495153280155668> User: ${interaction.user}`,
                        `> <:pp198:853494893439352842> UserID: \`${interaction.user.id}\``,
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
                        `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}!`
                    )
                );
            });
    },
};
