const { EmbedBuilder } = require("discord.js");
const sourcebin = require("sourcebin_js");
const TicketSchema = require("../../schema/Ticket-Schema");
const { InfoEmbed, ErrorEmbed } = require("../../util/modules/embeds");

/**
 * @type {import("../../util/types/baseComponent")}
 */
module.exports = {
    name: "btn_transcript",
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
            });
        }

        if (!TicketData || !TicketData.IsClosed) {
            return interaction.followUp({
                embeds: [ErrorEmbed("This ticket is not closed!")],
                ephemeral: true,
            });
        }

        try {
            const messages = await interaction.channel.messages.fetch();
            const output = messages
                .reverse()
                .map(m => `${new Date(m.createdAt).toLocaleString("en-US")} - ${m.author.tag}: ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`)
                .join("\n");

            let response;
            try {
                response = await sourcebin.create([
                    {
                        name: " ",
                        content: output,
                        languageId: "text",
                    },
                ], {
                    title: `Chat transcript for ${interaction.channel.name}`,
                    description: " ",
                });
            } catch (e) {
                console.error(e);
                return interaction.followUp({
                    content: "An error occurred, please try again!",
                    ephemeral: true,
                });
            }

            const TicketUser = await client.users.fetch(TicketData.UserId);

            const embed = new EmbedBuilder()
                .setAuthor({
                    name: interaction.guild.name,
                    iconURL: interaction.guild.iconURL({ dynamic: true }),
                })
                .setTitle("Ticket Logs.")
                .setDescription(`<:Tag:836168214525509653> ${interaction.channel.name} Ticket at ${interaction.guild.name}!`)
                .addFields(
                    { name: "Ticket transcript", value: `[View](${response.url})`, inline: true },
                    { name: "Opened by", value: `${TicketUser.tag}`, inline: true },
                    { name: "Opened At", value: `<t:${TicketData.OpenTimeStamp}>`, inline: true }
                )
                .setTimestamp()
                .setFooter({
                    text: client.user.username,
                    iconURL: client.user.displayAvatarURL({ dynamic: true }),
                })
                .setColor("738ADB");

            await interaction.user.send({ embeds: [embed] }).catch(() => {return interaction.followUp({ embeds: [ErrorEmbed("💢 I couldn't send the transcript to your **DM**!")], ephemeral: true })}).then(() => interaction.followUp({
                embeds: [InfoEmbed("Sent transcript to your DM!")],
                ephemeral: true,
            }));
        } catch (err) {
            console.error(err);
            return interaction.followUp({
                content: "An error occurred while fetching the messages, please try again!",
                ephemeral: true,
            });
        }
    },
};
