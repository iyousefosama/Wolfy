const discord = require("discord.js");
const { Collection, PermissionsBitField, ChannelType } = require("discord.js");
const sourcebin = require("sourcebin_js");
const schema = require("../schema/GuildSchema");
const TicketSchema = require("../schema/Ticket-Schema");
const {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
} = require("discord.js");
const cooldowns = new Collection();
const CoolDownCurrent = {};

module.exports = {
  name: "interactionCreate",
  async execute(client, interaction) {
    try {
      // Permissions: To check for default permissions in the guild
      if (interaction.guild) {
        if (
          !interaction.channel
            .permissionsFor(interaction.guild.members.me)
            .has(PermissionsBitField.Flags.SendMessages)
        ) {
          return { executed: false, reason: "PERMISSION_SEND" };
        } else {
          // Do nothing..
        }
        if (
          !interaction.channel
            .permissionsFor(interaction.guild.members.me)
            .has(PermissionsBitField.Flags.ViewChannel)
        ) {
          return { executed: false, reason: "PERMISSION_VIEW_CHANNEL" };
        } else {
          // Do nothing..
        }
        if (
          !interaction.channel
            .permissionsFor(interaction.guild.members.me)
            .has(PermissionsBitField.Flags.ReadMessageHistory)
        ) {
          return interaction.channel.send({
            content:
              '"Missing Access", the bot is missing the `READ_MESSAGE_HISTORY` permission please enable it!',
          });
        } else {
          // Do nothing..
        }
        if (
          !interaction.channel
            .permissionsFor(interaction.guild.members.me)
            .has(PermissionsBitField.Flags.EmbedLinks)
        ) {
          return interaction.channel.send({
            content:
              '"Missing Permissions", the bot is missing the `EMBED_LINKS` permission please enable it!',
          });
        } else {
          // Do nothing..
        }
      }
    } catch (err) {
      console.log(err);
    }

    if (interaction.isButton()) {
      ///////////// Ticket button inteaction
      if (interaction.customId === "ticket") {
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
                }**, please cool down! (**${timeLeft.toFixed(
                  0
                )}** second(s) left)`,
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
        let data;
        let TicketData;
        try {
          data = await schema.findOne({
            GuildID: interaction.guild.id,
          });
          TicketData = await TicketSchema.findOne({
            guildId: interaction.guild.id,
            UserId: interaction.user.id,
          });
          if (!data) {
            data = await schema.create({
              GuildID: interaction.guild.id,
            });
          }
          if (!TicketData) {
            TicketData = await TicketSchema.create({
              guildId: interaction.guild.id,
              UserId: interaction.user.id,
            });
          }
        } catch (err) {
          console.log(err);
          interaction.channel.send({
            content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`,
          });
        }

        // getting in the ticket category
        const categoryID = interaction.guild.channels.cache.get(
          data.Mod.Tickets.channel
        );
        let Channel = client.channels.cache.get(TicketData.ChannelId);

        // if there is no ticket category return
        if (!categoryID) {
          return interaction.followUp({
            content: `\\❌ **${interaction.member.displayName}**, I can't find the tickets channel please contact mod or use \`w!setticketch\` cmd`,
            ephemeral: true,
          });
        } else if (!data.Mod.Tickets.isEnabled) {
          return interaction.followUp({
            content: `\\❌ **${interaction.member.displayName}**, The **tickets** command is disabled in this server!`,
            ephemeral: true,
          });
        } else {
          // Do nothing..
        }

        var userName = interaction.user.username;

        var userDiscriminator = interaction.user.discriminator;

        let TicketAvailable = false;
        interaction.guild.channels.cache.forEach((channel) => {
          if (Channel && channel.id == Channel.id) {
            TicketAvailable = true;
            return;
          }
        });

        if (TicketAvailable)
          return interaction.followUp({
            content:
              "<:error:888264104081522698> **|** You already have a ticket!",
            ephemeral: true,
          });

        interaction.guild.channels
          .create({
            name: userName.toLowerCase() + "-" + userDiscriminator,
            type: ChannelType.GuildText,
            parent: categoryID,
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
              .setCustomId("98418541981561")
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
      }
      // * Ticket controll interactions
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
                }**, please cool down! (**${timeLeft.toFixed(
                  0
                )}** second(s) left)`,
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
          return interaction.channel.send(
            `\\❌ This ticket is already closed!`
          );
        }
        const Channel = interaction.guild.channels.cache.get(
          TicketData.ChannelId
        );

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
        const row = new ActionRowBuilder().addComponents(
          button,
          button2,
          button3
        );
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
            return interaction.channel.send(
              "An error occurred, please try again!"
            );
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
                }**, please cool down! (**${timeLeft.toFixed(
                  0
                )}** second(s) left)`,
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
        const Channel = interaction.guild.channels.cache.get(
          TicketData.ChannelId
        );

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
                }**, please cool down! (**${timeLeft.toFixed(
                  0
                )}** second(s) left)`,
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
    }
    let data;

    if (interaction.isStringSelectMenu()) {
      let choice = interaction.values[0];

      async function SelectRoles() {
        if (interaction.guild) {
          try {
            data = await schema.findOne({
              GuildID: interaction.guild.id,
            });
          } catch (err) {
            console.log(err);
            interaction.reply({
              content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`,
            });
          }
        }
        if (!data)
          return interaction.reply(
            `\\❌ I can't find this guild \`data\` in the data base!`
          );
        const member = interaction.member;

        // Get all the roles at once
        const roles = [
          data?.Mod.smroles.value1,
          data?.Mod.smroles.value2,
          data?.Mod.smroles.value3,
          data?.Mod.smroles.value4,
          data?.Mod.smroles.value5,
          data?.Mod.smroles.value6,
        ]
          .map((value) => interaction.guild.roles.cache.get(value))
          .filter((role) => !!role);

        // Find the selected role and perform the necessary action
        const selectedRole = roles.find((role) => role?.id === choice);
        if (!selectedRole) {
          return interaction.reply({
            content: `\\❌ I can't find this role in the guild!`,
            ephemeral: true,
          });
        }

        if (member.roles.cache.has(selectedRole.id)) {
          return await member.roles
            .remove(selectedRole)
            .then(() => {
              interaction.reply({
                content: `<a:pp833:853495989796470815> Successfully removed ${selectedRole} from you!`,
                ephemeral: true,
              });
            })
            .catch(
              async (err) =>
                await interaction.channel.send({
                  content: `\\❌ Failed to remove the role **${selectedRole}** for ${member.user.tag}, \`${err.message}\`!`,
                })
            );
        } else {
          return await member.roles
            .add(selectedRole)
            .then(() => {
              interaction.reply({
                content: `<a:pp330:853495519455215627> Successfully added ${selectedRole} for you!`,
                ephemeral: true,
              });
            })
            .catch(
              async (err) =>
                await interaction.channel.send({
                  content: `\\❌ Failed to add the role **${selectedRole}** for ${member.user.tag}, \`${err.message}\`!`,
                })
            );
        }
      }

      switch (interaction.customId) {
        case "kwthbek4m221pyddhwk":
          return SelectRoles();
        case "kwthbek4m221pyddhwp4":
          if (choice == "auto_reminder1") {
          }
        default:
          return;
      }
    }
    if (interaction.isChatInputCommand()) {
      const slash = client.slashCommands.get(interaction.commandName);

      if (!slash) {
        return;
      } else if (interaction.user.bot) {
        return;
      } else {
        // Do nothing..
      }

      try {
        if (slash.guildOnly && interaction.channel.type === "DM") {
          return interaction.reply({
            content:
              "<a:pp802:768864899543466006> I can't execute that command inside DMs!",
            ephemeral: true,
          });
        }

        if (slash.ownerOnly && !client.owners.includes(interaction.user.id)) {
          return interaction.reply({
            content:
              "<a:pp802:768864899543466006> This command is limited for developers only!",
            ephemeral: true,
          });
        }
        //+ permissions: [""],
        if (slash.permissions) {
          if (interaction.guild) {
            const sauthorPerms = interaction.channel.permissionsFor(
              interaction.user
            );
            if (!sauthorPerms || !sauthorPerms.has(slash.permissions)) {
              return interaction.reply({
                content: `<a:pp802:768864899543466006> You don\'t have \`${slash.permissions}\` permission(s) to use ${interaction.commandName} command.`,
                ephemeral: true,
              });
            }
          }
        }
        //+ clientpermissions: [""],
        if (slash.clientpermissions) {
          if (interaction.guild) {
            const sclientPerms = interaction.channel.permissionsFor(
              interaction.guild.members.me
            );
            if (!sclientPerms || !sclientPerms.has(slash.clientpermissions)) {
              return interaction.reply({
                content: `<a:pp802:768864899543466006> The bot is missing \`${slash.clientpermissions}\` permission(s)!`,
                ephemeral: true,
              });
            }
          }
        }
        console.log(
          `(/) ${interaction.user.tag}|(${interaction.user.id}) in ${
            interaction.guild
              ? `${interaction.guild.name}(${interaction.guild.id}) | #${interaction.channel.name}(${interaction.channel.id})`
              : "DMS"
          } used: /${interaction.commandName}`
        );
        await interaction.deferReply().catch(() => {});
        slash.execute(client, interaction);
      } catch (error) {
        console.error(error);
        await interaction
          .editReply({
            content: "There was an error while executing this command!",
            ephemeral: true,
          })
          .catch(() => {});
      }
    }
  },
};
