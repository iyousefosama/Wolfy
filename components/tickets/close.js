const discord = require("discord.js");
const {
  ActionRowBuilder,
  ButtonBuilder,
  Collection,
} = require("discord.js");
const TicketSchema = require("../../schema/Ticket-Schema");
const cooldowns = new Collection();
const CoolDownCurrent = {};

/**
 * @type {import("../../util/types/baseComponent")}
 */
module.exports = {
    // Component configuration
    name: "btn_close",
    enabled: true,
    // Action to perform when the button is clicked
    async action(client, interaction, parts) {
        //+ cooldown 1, //seconds(s)
        if (!cooldowns.has("btn")) {
            cooldowns.set("btn", new discord.Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get("btn");
        const cooldownAmount = (4 || 2) * 1000;

        if (timestamps.has(interaction.user.id)) {
            const expirationTime =
                timestamps.get(interaction.user.id) + cooldownAmount;

            if (now < expirationTime) {
                if (CoolDownCurrent[interaction.user.id]) {
                    return;
                }
                const timeLeft = (expirationTime - now) / 1000;
                CoolDownCurrent[interaction.user.id] = true;
                return await interaction
                    .reply({
                        content: ` **${interaction.user.username
                            }**, please cool down! (**${timeLeft.toFixed(0)}** second(s) left)`,
                        ephemeral: true,
                        fetchReply: true,
                    })
                    .then(() => {
                        setTimeout(() => {
                            delete CoolDownCurrent[interaction.user.id];
                        }, 3000);
                    });
            }
        }
        timestamps.set(interaction.user.id, now);
        setTimeout(
            () => timestamps.delete(interaction.user.id),
            cooldownAmount,
            delete CoolDownCurrent[interaction.user.id]
        );
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

        if (!TicketData)
            return interaction.channel.send(
                `\\❌ I can't find this guild \`data\` in the data base!`
            );
        if (TicketData.IsClosed) {
            return interaction.channel.send(`\\❌ This ticket is already closed!`);
        }
        const Channel = interaction.guild.channels.cache.get(TicketData.ChannelId);

        Channel.permissionOverwrites.edit(TicketData.UserId, {
            SendMessages: false,
            ViewChannel: false,
        });

        const button = new ButtonBuilder()
            .setLabel(`Transcript`)
            .setCustomId("btn_transcript")
            .setStyle("Secondary")
            .setEmoji("853495194863534081");
        const button2 = new ButtonBuilder()
            .setLabel(`Re-Open`)
            .setCustomId("btn_reopen")
            .setStyle("Primary")
            .setEmoji("🔓");
        const button3 = new ButtonBuilder()
            .setLabel(`Delete`)
            .setCustomId("btn_delete")
            .setStyle("Danger")
            .setEmoji("853496185443319809");
        const row = new ActionRowBuilder().addComponents(button, button2, button3);
        const Closed = new discord.EmbedBuilder()
            .setAuthor({
                name: `Closed by ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
            })
            .setColor("#2F3136")
            .setDescription(`\`\`\`Support team ticket controls\`\`\``);
        TicketData.IsClosed = true;
        await TicketData.save()
            .then(() => {
                interaction.channel.send({ embeds: [Closed], components: [row] });
            })
            .catch(() => {
                interaction.channel.send({
                    content: `\`❌ [ERR]:\` Something is wrong, please try again later!`,
                });
            });
    },
};
