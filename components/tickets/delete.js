const { EmbedBuilder } = require("discord.js");
const { ErrorEmbed } = require("../../util/modules/embeds")
const TicketSchema = require("../../schema/Ticket-Schema");
const sourcebin = require('sourcebin_js');

/**
 * @type {import("../../util/types/baseComponent")}
 */
module.exports = {
    name: "btn_delete",
    enabled: true,
    async action(client, interaction, parts) {
        await interaction.deferUpdate();

        try {
            const TicketData = await TicketSchema.findOne({
                guildId: interaction.guild.id,
                ChannelId: interaction.channel.id,
                Category: interaction.channel.parentId,
            });

            if (!TicketData)
                return interaction.channel.send(`\\❌ I can't find this ticket \`data\` in the data base!`);

            if (!TicketData.IsClosed) {
                return interaction.followUp({ content: `\\❌ Ticket is not closed!`, ephemeral: true });
            }

            await interaction.channel.send({ embeds: [ErrorEmbed('<a:pp681:774089750373597185> Ticket will be deleted in `5 seconds`!')] });

            setTimeout(async () => {
                try {
                    const messages = await interaction.channel.messages.fetch();
                    const output = messages.reverse().map(m => `${new Date(m.createdAt).toLocaleString("en-US")} - ${m.author.tag}: ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`).join("\n");

                    const response = await sourcebin.create([
                        {
                            name: " ",
                            content: output,
                            languageId: "text",
                        },
                    ], {
                        title: `Chat transcript for ${interaction.channel.name}`,
                        description: " ",
                    });

                    const channel = interaction.channel;

                    await TicketSchema.findOneAndDelete({ guildId: interaction.guild.id, ChannelId: channel.id, Category: interaction.channel.parentId });
                    await interaction.channel.delete();

                    const TicketUser = await interaction.guild.members.fetch(TicketData.UserId);

                    const closedEmbed = new EmbedBuilder()
                        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                        .setTitle("Ticket Closed.")
                        .setDescription(`<:Tag:836168214525509653> Ticket ${channel.name} at ${interaction.guild.name} has been closed!`)
                        .addFields(
                            { name: "Ticket transcript", value: `[View](${response.url})`, inline: true },
                            { name: "Opened by", value: `${TicketUser.user.tag}`, inline: true },
                            { name: "Closed by", value: `${interaction.user.tag}`, inline: true },
                            { name: "Opened At", value: `<t:${TicketData.OpenTimeStamp}>`, inline: true }
                        )
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                        .setColor("#2F3136");

                    await TicketUser.send({ embeds: [closedEmbed] }).catch(() => null);
                } catch (err) {
                    console.error(err);
                    interaction.followUp(`\\❌ [\`${err.name}\`]: An error occurred, please try again!`);
                }
            }, 5000);
        } catch (err) {
            console.error(err);
            interaction.followUp({ content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}` });
        }
    },
};
