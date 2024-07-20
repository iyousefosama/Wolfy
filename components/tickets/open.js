const discord = require("discord.js");
const {
    ActionRowBuilder,
    ButtonBuilder,
    Collection,
    PermissionsBitField,
    ChannelType,
} = require("discord.js");
const schema = require("../../schema/Panel-schema");
const TicketSchema = require("../../schema/Ticket-Schema");

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
                    content: `\\❌ **${interaction.member}**, I can't find this category in my database!`,
                })
            }
        } catch (err) {
            console.log(err);
            interaction.channel.send({
                content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`,
            });
        }

        // getting in the ticket category
        const category = interaction.guild.channels.cache.get(data.Category);

        // if there is no ticket category return
        if (!category) {
            return interaction.followUp({
                content: `\\❌ **${interaction.member.displayName}**, I can't find the tickets channel please contact mod or use \`/panel create\` cmd`,
                ephemeral: true,
            });
        } else if (!data.Enabled) {
            return interaction.followUp({
                content: `\\❌ **${interaction.member.displayName}**, The **tickets** command is disabled in this server!`,
                ephemeral: true,
            });
        } else {
            // Do nothing..
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
            interaction.channel.send({
                content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`,
            });
        }

        var userName = interaction.user.username;

        var userDiscriminator = interaction.user.discriminator;

        // Check if category has already ticket from that user
        if (category.children.cache.has(TicketData.ChannelId)) {
            return interaction.followUp({
                content: "<:error:888264104081522698> | You already have a ticket in that panel!",
                ephemeral: true,
            });
        }

        interaction.guild.channels
            .create({
                name: userName.toLowerCase() + "-" + userDiscriminator,
                type: ChannelType.GuildText,
                parent: category,
                permissionOverwrites: [
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
                    },
                ],
            })
            .then(async (channel) => {
                interaction.followUp({
                    content: `<:Verify:841711383191879690> Successfully created ${channel} ticket!`,
                    ephemeral: true,
                });
                const button = new ButtonBuilder()
                    .setLabel(`Close`)
                    .setCustomId("btn_close")
                    .setStyle("Secondary")
                    .setEmoji("🔒");
                const row = new ActionRowBuilder().addComponents(button);
                var ticketEmbed = new discord.EmbedBuilder()
                    .setAuthor({
                        name: `Welcome in your ticket ${interaction.user.tag}`,
                        iconURL: interaction.user.displayAvatarURL({
                            dynamic: true,
                            size: 2048,
                        }),
                    })
                    .setDescription(
                        `<:tag:813830683772059748> Send here your message or question!
                              
                              > <:Humans:853495153280155668> User: ${interaction.user}
                              > <:pp198:853494893439352842> UserID: \`${interaction.user.id}\``
                    )
                    .setTimestamp();
                channel.send({
                    content: `${interaction.user}`,
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
