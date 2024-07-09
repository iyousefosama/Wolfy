const discord = require("discord.js");
const {
    ActionRowBuilder,
    ButtonBuilder,
    Collection,
} = require("discord.js");
const sourcebin = require("sourcebin_js");
const TicketSchema = require("../../schema/Ticket-Schema");
const cooldowns = new Collection();
const CoolDownCurrent = {};

/**
 * @type {import("../../util/types/baseComponent")}
 */
module.exports = {
    // Component configuration
    name: "btn_transcript",
    enabled: true,
    // Action to perform when the button is clicked
    async action(client, interaction, parts) {
        await interaction.deferUpdate();
        try {
            TicketData = await TicketSchema.findOne({
                guildId: interaction.guild.id,
                ChannelId: interaction.channel.id,
            });
        } catch (err) {
            console.log(err);
            interaction.followUp({
                content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`,
            });
        }
        if (!TicketData.IsClosed) {
            return interaction.channel.send(
                `\\❌ ${interaction.user}, This ticket is not closed!`
            );
        }
        interaction.channel.messages.fetch().then(async (messages) => {
            const output = messages
                .reverse()
                .map(
                    (m) =>
                        `${new Date(m.createdAt).toLocaleString("en-US")} - ${m.author.tag
                        }: ${m.attachments.size > 0
                            ? m.attachments.first().proxyURL
                            : m.content
                        }`
                )
                .join("\n");

            let response;
            try {
                response = await sourcebin.create(
                    [
                        {
                            name: " ",
                            content: output,
                            languageId: "text",
                        },
                    ],
                    {
                        title: `Chat transcript for ${interaction.channel.name}`,
                        description: " ",
                    }
                );
            } catch (e) {
                console.log(e);
                return interaction.channel.send("An error occurred, please try again!");
            }

            const TicketUser = client.users.cache.get(TicketData.UserId);

            const embed = new discord.EmbedBuilder()
                .setAuthor({
                    name: interaction.guild.name,
                    iconURL: interaction.guild.iconURL({ dynamic: true }),
                })
                .setTitle("Ticket Logs.")
                .setDescription(
                    `<:Tag:836168214525509653> ${interaction.channel.name} Ticket at ${interaction.guild.name}!`
                )
                .addFields(
                    {
                        name: "Ticket transcript",
                        value: `[View](${response.url})`,
                        inline: true,
                    },
                    { name: "Opened by", value: `${TicketUser.tag}`, inline: true },
                    {
                        name: "Opened At",
                        value: `<t:${TicketData.OpenTimeStamp}>`,
                        inline: true,
                    }
                )
                .setTimestamp()
                .setFooter({
                    text: client.user.username,
                    iconURL: client.user.displayAvatarURL({ dynamic: true }),
                })
                .setColor("738ADB");
            return (
                await interaction.user.send({ embeds: [embed] }),
                interaction.followUp({
                    content: `${interaction.user} Successfully sent you the \`transcript\` in the dms!`,
                    ephemeral: true,
                })
            );
        });
    },
};
