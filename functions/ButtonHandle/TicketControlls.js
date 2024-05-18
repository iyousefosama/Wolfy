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

exports.click = async function (client, interaction) {
  if (interaction.customId === "98418541981561") {
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
            content: ` **${
              interaction.user.username
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
      .setCustomId("98418541981564")
      .setStyle("Secondary")
      .setEmoji("853495194863534081");
    const button2 = new ButtonBuilder()
      .setLabel(`Re-Open`)
      .setCustomId("98418541981565")
      .setStyle("Primary")
      .setEmoji("🔓");
    const button3 = new ButtonBuilder()
      .setLabel(`Delete`)
      .setCustomId("98418541981566")
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
  } else if (interaction.customId == "98418541981564") {
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
            `${new Date(m.createdAt).toLocaleString("en-US")} - ${
              m.author.tag
            }: ${
              m.attachments.size > 0
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
  } else if (interaction.customId == "98418541981565") {
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
            content: ` **${
              interaction.user.username
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
    if (!TicketData.IsClosed) {
      return interaction.channel.send(
        `\\❌ ${interaction.user}, This ticket is not closed!`
      );
    }
    if (!TicketData)
      return interaction.channel.send(
        `\\❌ I can't find this guild \`data\` in the data base!`
      );
    const Channel = interaction.guild.channels.cache.get(TicketData.ChannelId);

    Channel.permissionOverwrites.edit(TicketData.UserId, {
      SendMessages: true,
      ViewChannel: true,
    });

    const embed = new discord.EmbedBuilder()
      .setAuthor({
        name: interaction.user.tag,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setDescription(
        `<:Verify:841711383191879690> Successfully re-opened the ticket by \`${interaction.user.tag}\`!`
      )
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setColor("Green");
    TicketData.IsClosed = false;
    await TicketData.save()
      .then(() => {
        interaction.channel.send({ embeds: [embed] });
      })
      .catch(() => {
        interaction.channel.send({
          content: `\`❌ [ERR]:\` Something is wrong, please try again later!`,
        });
      });
  } else if (interaction.customId == "98418541981566") {
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
            content: ` **${
              interaction.user.username
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
    if (!TicketData.IsClosed) {
      return interaction.channel.send(
        `\\❌ ${interaction.user}, This ticket is not closed!`
      );
    }
    const close = new discord.EmbedBuilder()
      .setAuthor({
        name: interaction.user.tag,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setColor(`Red`)
      .setDescription(
        "<a:pp681:774089750373597185> Ticket will be deleted in `5 seconds`!"
      )
      .setFooter({
        text: interaction.guild.name,
        iconURL: interaction.guild.iconURL({ dynamic: true }),
      });
    interaction.channel.send({ embeds: [close] }).then((channel) => {
      setTimeout(async () => {
        let response;
        const Ticket = interaction.guild.channels.cache.get(
          TicketData.ChannelId
        );
        return await interaction.channel.messages
          .fetch()
          .then(async (messages) => {
            const output = messages
              .reverse()
              .map(
                (m) =>
                  `${new Date(m.createdAt).toLocaleString("en-US")} - ${
                    m.author.tag
                  }: ${
                    m.attachments.size > 0
                      ? m.attachments.first().proxyURL
                      : m.content
                  }`
              )
              .join("\n");

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
              return interaction.channel.send(
                "An error occurred, please try again!"
              );
            }
          })
          .then(async () => {
            return await interaction.channel.delete();
          })
          .then(async () => {
            const TicketUser = client.users.cache.get(TicketData.UserId);

            const Closedembed = new discord.EmbedBuilder()
              .setAuthor({
                name: interaction.guild.name,
                iconURL: interaction.guild.iconURL({ dynamic: true }),
              })
              .setTitle("Ticket Closed.")
              .setDescription(
                `<:Tag:836168214525509653> ${Ticket.name} Ticket at ${interaction.guild.name} Just closed!`
              )
              .addFields(
                {
                  name: "Ticket transcript",
                  value: `[View](${response.url}) for channel`,
                  inline: true,
                },
                {
                  name: "Opened by",
                  value: `${TicketUser.tag}`,
                  inline: true,
                },
                {
                  name: "Closed by",
                  value: `${interaction.user.tag}`,
                  inline: true,
                },
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
              .setColor("#2F3136");
            await TicketUser.send({ embeds: [Closedembed] });
          })
          .catch((err) => console.log(err));
      }, 5000);
    });
  }
};
