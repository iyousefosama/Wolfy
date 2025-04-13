const {
  EmbedBuilder,
  ChannelType,
  ActionRowBuilder,
  ButtonBuilder,
  ApplicationCommandOptionType
} = require("discord.js");
const schema = require("../../schema/Panel-schema")
const { ErrorEmbed, SuccessEmbed } = require("../../util/modules/embeds")
const Page = require('../../util/Paginate');

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "panel",
    description: "Manage tickets panel in the server",
    group: "Ticket",
    requiresDatabase: true,
    dmOnly: false,
    guildOnly: true,
    options: [
      {
        type: ApplicationCommandOptionType.Subcommand,
        name: "create",
        description: "Create new ticket panel in the server",
        options: [
          {
            type: ApplicationCommandOptionType.Channel,
            name: "category",
            description: "Set panel's ticket category to add new tickets to it",
            channelTypes: [ChannelType.GuildCategory],
            required: true
          },
          {
            type: ApplicationCommandOptionType.Channel,
            name: "channel",
            description: "A channel to send the ticket panel embed to",
            channelTypes: [ChannelType.GuildText],
            required: false
          },
          {
            type: ApplicationCommandOptionType.String,
            name: "message",
            description: "Set a custom message to be sent when the user open a ticket",
            required: false
          },
          {
            type: ApplicationCommandOptionType.Role,
            name: "role",
            description: "Set a modrole than can access the opened ticket in the panel",
            required: false
          },
          {
            type: ApplicationCommandOptionType.Channel,
            name: "logs",
            description: "A channel to send the tickets logs to",
            channelTypes: [ChannelType.GuildText],
            required: false
          },
        ]
      },
      {
        type: ApplicationCommandOptionType.Subcommand,
        name: "delete",
        description: "Delete ticket panel in the server",
        options: [
          {
            type: ApplicationCommandOptionType.Channel,
            name: "category",
            description: "The ticket panel's category-id to delete",
            channelTypes: [ChannelType.GuildCategory],
            required: true
          }
        ]
      },
      {
        type: ApplicationCommandOptionType.Subcommand,
        name: "remove-deleted",
        description: "Removes deleted categories panels from the database",
      },
      {
        type: ApplicationCommandOptionType.Subcommand,
        name: "edit",
        description: "Edit ticket panels status",
        options: [
          {
            type: ApplicationCommandOptionType.Channel,
            name: "category",
            description: "The ticket panel's category-id to edit",
            channelTypes: [ChannelType.GuildCategory],
            required: true
          },
          {
            type: ApplicationCommandOptionType.Boolean,
            name: "enabled",
            description: "Allow/disallow members from using this panel",
            required: false
          },
          {
            type: ApplicationCommandOptionType.String,
            name: "message",
            description: "Set a custom message to be sent when the user open a ticket",
            required: false
          },
          {
            type: ApplicationCommandOptionType.Role,
            name: "role",
            description: "Set a modrole than can access the opened ticket in the panel",
            required: false
          },
          {
            type: ApplicationCommandOptionType.Channel,
            name: "logs",
            description: "A channel to send the tickets logs to",
            channelTypes: [ChannelType.GuildText],
            required: false
          },
        ]
      },
      {
        type: ApplicationCommandOptionType.Subcommand,
        name: "list",
        description: "List all ticket panels in the server",
      },
      {
        type: ApplicationCommandOptionType.Subcommand,
        name: "send",
        description: "Send ticket panel embed to specified channel",
        options: [
          {
            type: ApplicationCommandOptionType.Channel,
            name: "category",
            description: "The panel category to send embed for",
            channelTypes: [ChannelType.GuildCategory],
            required: true
          },
          {
            type: ApplicationCommandOptionType.Channel,
            name: "channel",
            description: "The channel to send panel embed to",
            channelTypes: [ChannelType.GuildText],
            required: false
          }
        ]
      }
    ],
    clientPermissions: ["SendMessages"],
    permissions: ["ManageGuild"],
  },
  async execute(client, interaction) {
    const { guild, options } = interaction;

    const subCommand = options.getSubcommand();
    const category = options.getChannel("category");
    const channel = options.getChannel("channel");
    const enabled = options.getBoolean("enabled");
    const message = options.getString("message");
    const role = options.getRole("role");
    const logs = options.getChannel("logs");

    switch (subCommand) {
      case "create":
        let data = await schema.findOne({ Guild: guild.id, Category: category.id });

        if (data) {
          return interaction.reply({ 
            embeds: [ErrorEmbed(client.language.getString("PANEL_CREATE_ALREADY_EXISTS", guild.id, {
              category: category.toString()
            }))], 
            ephemeral: true 
          });
        }

        /**
         * @type {import("mongoose").Number}
         */
        let panelCount = await schema.find({ Guild: guild.id }).countDocuments();
        const maxPanels = client.config.ticket?.max_panels ?? 5;

        if (panelCount >= maxPanels) {
          return interaction.reply({ 
            embeds: [ErrorEmbed(client.language.getString("PANEL_CREATE_LIMIT_REACHED", guild.id, {
              max_panels: maxPanels
            }))], 
            ephemeral: true 
          });
        }

        try {
          await schema.create({
            Guild: guild.id,
            Category: category.id,
            Admin: interaction.user.id,
            Enabled: enabled ?? true,
            Message: message ?? null,
            ModRole: role?.id ?? null,
            logs: logs?.id ?? null,
          });

          if (channel) {
            sendPanelEmbed(client, interaction);
          }

          panelCount = await schema.find({ Guild: guild.id }).countDocuments();

          interaction.reply({ 
            embeds: [SuccessEmbed(client.language.getString("PANEL_CREATE_SUCCESS", guild.id, {
              category: category.toString(),
              count: panelCount
            }))], 
            ephemeral: true 
          });
        } catch (err) {
          console.error("Error creating panel:", err);
          interaction.reply({ 
            embeds: [ErrorEmbed(client.language.getString("PANEL_CREATE_ERROR", guild.id))], 
            ephemeral: true 
          });
        }
        break;

      case "delete":
        const toRemove = await schema.findOneAndDelete({ Guild: guild.id, Category: category.id });

        if (!toRemove) {
          return interaction.reply({ 
            embeds: [ErrorEmbed(client.language.getString("PANEL_DELETE_NOT_FOUND", guild.id, {
              category: category.toString()
            }))], 
            ephemeral: true 
          });
        }

        interaction.reply({ 
          embeds: [SuccessEmbed(client.language.getString("PANEL_DELETE_SUCCESS", guild.id, {
            category: category.toString()
          }))],
          ephemeral: true 
        });
        break;
      case "remove-deleted":
        let deletedCount = 0;
        let panelsToCheck = await schema.find({ Guild: guild.id });
        for (const panel of panelsToCheck) {
          let category = guild.channels.cache.get(panel.Category);

          if (!category) {
            await schema.findOneAndDelete({ Guild: guild.id, Category: panel.Category });
            deletedCount++;
          }
        }

        if (deletedCount === 0) {
          return interaction.reply({ 
            embeds: [ErrorEmbed(client.language.getString("PANEL_REMOVE_DELETED_NONE", guild.id))], 
            ephemeral: true 
          });
        }

        interaction.reply({ 
          embeds: [SuccessEmbed(client.language.getString("PANEL_REMOVE_DELETED_SUCCESS", guild.id, {
            count: deletedCount
          }))], 
          ephemeral: true 
        });
        break;
      case "edit":
        // Fetch the panel from the database
        let toEdit = await schema.findOne({ Guild: guild.id, Category: category.id });

        if (!toEdit) {
          return interaction.reply({
            embeds: [ErrorEmbed(client.language.getString("PANEL_EDIT_NOT_FOUND", guild.id, {
              category: category.toString()
            }))],
            ephemeral: true
          });
        }

        // Prepare an object to hold the updates
        const updateFields = {};
        const updates = [];

        if (enabled !== null && enabled !== toEdit.Enabled) {
          updateFields.Enabled = enabled;
          updates.push(client.language.getString("PANEL_EDIT_ENABLED", guild.id, {
            value: enabled ? 
              client.language.getString("PANEL_LIST_ENABLED", guild.id) : 
              client.language.getString("PANEL_LIST_DISABLED", guild.id)
          }));
        }

        if (message && message !== toEdit.Message) {
          updateFields.Message = message;
          updates.push(client.language.getString("PANEL_EDIT_MESSAGE", guild.id, {
            value: message
          }));
        }

        if (role && role.id !== toEdit.Role) {
          updateFields.ModRole = role.id;
          updates.push(client.language.getString("PANEL_EDIT_ROLE", guild.id, {
            value: role.toString()
          }));
        }

        if (logs && logs.id !== toEdit.logs) {
          updateFields.logs = logs.id;
          updates.push(client.language.getString("PANEL_EDIT_LOGS", guild.id, {
            value: logs.toString()
          }));
        }

        if (Object.keys(updateFields).length === 0) {
          return interaction.reply({
            embeds: [ErrorEmbed(client.language.getString("PANEL_EDIT_NO_CHANGES", guild.id))],
            ephemeral: true
          });
        }

        try {
          // Update only the provided fields in the database
          await schema.findOneAndUpdate(
            { Guild: guild.id, Category: category.id },
            updateFields
          );

          return interaction.reply({
            embeds: [SuccessEmbed(client.language.getString("PANEL_EDIT_SUCCESS", guild.id, {
              updates: updates.join("\n")
            }))],
            ephemeral: true
          });
        } catch (err) {
          console.error("Error updating panel:", err);
          return interaction.reply({
            embeds: [ErrorEmbed(client.language.getString("PANEL_EDIT_ERROR", guild.id, {
              error: err.name
            }))],
            ephemeral: true
          });
        }
      case "list":
        const panels = await schema.find({ Guild: guild.id });

        if (!panels || panels.length === 0) {
          return interaction.reply({
            embeds: [ErrorEmbed(client.language.getString("PANEL_LIST_NONE", guild.id))],
            ephemeral: true,
          });
        }

        const embedFields = [];

        let deleted = 0
        for (const panel of panels) {
          let category = guild.channels.cache.get(panel.Category);

          if (!category) {
            // If the category is not found, remove the panel from the database
            await schema.deleteOne({ _id: panel._id });
            deleted++;
            continue;
          }

          embedFields
            .push(
              {
                name: `${category} (${panel.Category})`,
                value: "\n",
                inline: false
              },
              {
                name: client.language.getString("PANEL_LIST_ENABLED_LABEL", guild.id),
                value: panel.Enabled ? 
                  client.language.getString("PANEL_LIST_ENABLED", guild.id) : 
                  client.language.getString("PANEL_LIST_DISABLED", guild.id),
                inline: true
              },
              {
                name: client.language.getString("PANEL_LIST_TIME_CREATED", guild.id),
                value: `<t:${Math.floor(panel.createdAt.getTime() / 1000)}:R>`,
                inline: true
              },
              {
                name: client.language.getString("PANEL_LIST_ADMIN", guild.id),
                value: panel.Admin,
                inline: true
              },
              {
                name: client.language.getString("PANEL_LIST_MOD_ROLE", guild.id),
                value: panel.ModRole ? panel.ModRole : client.language.getString("PANEL_LIST_NONE_VALUE", guild.id),
                inline: true
              },
              {
                name: client.language.getString("PANEL_LIST_LOGS", guild.id),
                value: panel.logs ? panel.logs : client.language.getString("PANEL_LIST_NONE_VALUE", guild.id),
                inline: true
              },
              {
                name: client.language.getString("PANEL_LIST_CUSTOM_MESSAGE", guild.id),
                value: panel.Message ? panel.Message : client.language.getString("PANEL_LIST_NOT_SET", guild.id),
                inline: false
              },
              {
                name: '\u200B',
                value: '\u200B'
              },
            );
        }

        if (embedFields.length > 25) {
          // Split fields into groups of 25
          const embeds = [];
          for (let i = 0; i < embedFields.length; i += 25) {
            const embed = new EmbedBuilder()
              .setAuthor({
                name: client.language.getString("PANEL_LIST_TITLE", guild.id, {
                  guild_name: guild.name
                }),
                iconURL: guild.iconURL({ dynamic: true }),
              })
              .setDescription(
                client.language.getString("PANEL_LIST_DESCRIPTION", guild.id, {
                  count: panels.length
                })
              )
              .setFields(embedFields.slice(i, i + 25))
              .setFooter({
                text: [
                  client.language.getString("PANEL_LIST_FOOTER", guild.id, {
                    year: new Date().getFullYear()
                  }),
                  deleted > 0 ? client.language.getString("PANEL_LIST_DELETED_NOTICE", guild.id, {
                    count: deleted
                  }) : "",
                ].join("\n"),
                iconURL: client.user.avatarURL({ dynamic: true }),
              })
              .setTimestamp();

            embeds.push(embed);
          }


          const createRow = () => {
            const button = new ButtonBuilder()
              .setCustomId("prevPage")
              .setStyle('Primary')
              .setEmoji("890490643548352572");

            const buttonmid = new ButtonBuilder()
              .setLabel(`${pages.currentIndex + 1}/${pages.size}`)
              .setCustomId("currentPage")
              .setStyle('Secondary')
              .setDisabled(true);

            const button2 = new ButtonBuilder()
              .setCustomId("nextPage")
              .setStyle('Primary')
              .setEmoji("890490558492061736");

            return new ActionRowBuilder().addComponents(button, buttonmid, button2);
          };

          const pages = new Page(embeds);


          const msg = await interaction.reply({
            embeds: [pages.currentPage],
            components: [createRow()],
            fetchReply: true
          });

          const filter = i => i.user.id === interaction.user.id;
          const collector = msg.createMessageComponentCollector({ filter, time: 180000 });

          collector.on('collect', async interactionCreate => {
            await interactionCreate.deferUpdate();
            if (interactionCreate.customId === 'prevPage') {
              msg.edit({
                embeds: [pages.previous()],
                components: [createRow()]
              });
            } else if (interactionCreate.customId === 'nextPage') {
              msg.edit({
                embeds: [pages.next()],
                components: [createRow()]
              });
            }
          });

          collector.on('end', async () => {
            const disabledRow = createRow().components.forEach(button => button.setDisabled(true));
            msg.edit({ embeds: [pages.currentPage], components: [disabledRow] }).catch(() => null);
          });

          return;
        }

        const embed = new EmbedBuilder()
          .setAuthor({
            name: client.language.getString("PANEL_LIST_TITLE", guild.id, {
              guild_name: guild.name
            }),
            iconURL: guild.iconURL({ dynamic: true }),
          })
          .setDescription(
            client.language.getString("PANEL_LIST_DESCRIPTION", guild.id, {
              count: panels.length
            })
          )
          .setFields(embedFields)
          .setFooter({
            text: [
              client.language.getString("PANEL_LIST_FOOTER", guild.id, {
                year: new Date().getFullYear()
              }),
              deleted > 0 ? client.language.getString("PANEL_LIST_DELETED_NOTICE", guild.id, {
                count: deleted
              }) : ""
            ].join("\n"),
            iconURL: client.user.avatarURL({ dynamic: true }),
          })
          .setTimestamp();

        interaction.reply({ embeds: [embed], ephemeral: true });
        break;
      case 'send':
        const panel = await schema.findOne({ Guild: guild.id, Category: category.id });

        if (!panel) {
          return interaction.reply({ 
            embeds: [ErrorEmbed(client.language.getString("PANEL_SEND_NOT_FOUND", guild.id, {
              category: category.toString()
            }))], 
            ephemeral: true 
          });
        }

        try {
          await sendPanelEmbed(client, interaction);
          
          interaction.reply({ 
            embeds: [SuccessEmbed(client.language.getString("PANEL_SEND_SUCCESS", guild.id, {
              channel: channel.toString()
            }))], 
            ephemeral: true 
          });
        } catch (error) {
          return interaction.reply({ 
            embeds: [ErrorEmbed(client.language.getString("PANEL_SEND_ERROR", guild.id))], 
            ephemeral: true 
          });
        }
        break;
    }
  },
};

/**
 * A function to send ticket panel embed to a channel
 * @param {import("../../struct/Client")} client 
 * @param {import("discord.js").Interaction} interaction 
 * @param {String} message 
 */
const sendPanelEmbed = async (client, interaction, message) => {
  const { guild } = interaction;
  const category = interaction.options.getChannel("category")
  const channel = interaction.options.getChannel("channel")

  const button = new ButtonBuilder()
    .setLabel(client.language.getString("PANEL_EMBED_BUTTON", guild.id))
    .setCustomId(`btn_ticket_${category.id}`)
    .setEmoji("📩")
    .setStyle("Primary");
  const row = new ActionRowBuilder().addComponents(button);
  await channel.send({
    embeds: [
      new EmbedBuilder()
        .setColor("Red")
        .setAuthor({
          name: client.language.getString("PANEL_EMBED_TITLE", guild.id),
          iconURL: guild.iconURL({ dynamic: true }),
        })
        .setDescription(
          message ? message :
            client.language.getString("PANEL_EMBED_DESCRIPTION", guild.id)
        )
        .setFooter({
          text: client.language.getString("PANEL_EMBED_FOOTER", guild.id, {
            year: new Date().getFullYear()
          }),
          iconURL: client.user.avatarURL({ dynamic: true }),
        })
        .setTimestamp()
    ],
    components: [row],
  })
}