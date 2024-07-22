const {
  EmbedBuilder,
  ChannelType,
  ActionRowBuilder,
  ButtonBuilder,
  ApplicationCommandOptionType
} = require("discord.js");
const schema = require("../../schema/Panel-schema")
const { ErrorEmbed, SuccessEmbed } = require("../../util/modules/embeds")

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "panel",
    description: "Manage tickets panel in the server",
    group: "Ticket",
    requiresDatabase: true,
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
          }
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
            required: true
          }
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

    switch (subCommand) {
      case "create":
        let data = await schema.findOne({ Guild: guild.id, Category: category.id });

        if (data) {
          return interaction.reply({ embeds: [ErrorEmbed(`\\❌ Ticket category is already set to ${category}!`)], ephemeral: true });
        }

        /**
         * @type {import("mongoose").Number}
         */
        let panelCount = await schema.find({ Guild: guild.id }).countDocuments();
        const maxPanels = client.config.ticket?.max_panels ?? 5;

        if (panelCount >= maxPanels) {
          return interaction.reply({ embeds: [ErrorEmbed(`\\❌ You can only have \`${maxPanels}\` ticket panels in the server!`)], ephemeral: true });
        }

        try {
          await schema.create({
            Guild: guild.id,
            Category: category.id,
            Admin: interaction.user.id,
          });

          if (channel) {
            sendPanelEmbed(client, interaction);
          }

          panelCount = await schema.find({ Guild: guild.id }).countDocuments();

          interaction.reply({ embeds: [SuccessEmbed(`\\✔️ A new ticket panel is set to ${category}!\nYour server currently has \`${panelCount}\` ticket panels.`)], ephemeral: true });
        } catch (err) {
          console.error("Error creating panel:", err);
          interaction.reply({ embeds: [ErrorEmbed(`\\❌ An error occurred while creating the ticket panel. Please try again later.`)], ephemeral: true });
        }
        break;

      case "delete":
        const toRemove = await schema.findOneAndDelete({ Guild: guild.id, Category: category.id });

        if (!toRemove) {
          return interaction.reply({ embeds: [ErrorEmbed(`\\❌ There is no ticket panel set to ${category}!`)], ephemeral: true });
        }

        interaction.reply({ embeds: [SuccessEmbed(`\\✔️ Ticket panel is deleted with category ${category}!`)], ephemeral: true });
        break;
      case "edit":
        const Enabled = options.getBoolean("Enabled");

        let editData = schema.findOne({ Guild: guild.id, Category: category.id })

        if (!editData) {
          return interaction.reply({
            embeds: [ErrorEmbed(`\\❌ \`${category}\` is not a valid panel category!`)]
          })
        }

        const EnabledText = Enabled ? "Enabled" : "Disabled";

        if (Enabled === toEdit.Enabled) {
          interaction.reply({
            embeds: [ErrorEmbed(`\\❌ This panel status is already \`${EnabledText}\``)]
          })
        }

        await schema.findOneAndUpdate({ Guild: guild.id, Category: category.id }, { Enabled: Enabled })
          .then(() => interaction.reply({ embeds: [SuccessEmbed(`\\✔️ Ticket panel status has set to: \`${EnabledText}\``)] }))
          .catch(() => interaction.reply({ embeds: [ErrorEmbed(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`)], ephemeral: true }))
        break;
      case "list":
        const panels = await schema.find({ Guild: guild.id });

        if (!panels) {
          return interaction.reply({ embeds: [ErrorEmbed(`\\❌ There are no ticket panels in the server!`)], ephemeral: true });
        }

        const embedFields = panels.map((panel) => {
          let category = guild.channels.cache.get(panel.Category);
          let admin = guild.members.cache.get(panel.Admin);
          return {
            name: `${category} (${panel.Category})`,
            value: [`Enabled: ${panel.Enabled ? "Yes" : "No"}`, `Time Created: ${panel.createdAt}`, `Admin: ${admin}`].join("\n"),
          };
        })

        const embed = new EmbedBuilder()
          .setAuthor({
            name: `${guild.name} Panels list`,
            iconURL: guild.iconURL({ dynamic: true }),
          })
          .setDescription(
            `There are \`${panels.length}\` ticket panels in the server!`
          )
          .setFields(embedFields)
          .setFooter({
            text: `Ticket Panel | \©️${new Date().getFullYear()} Wolfy`,
            iconURL: client.user.avatarURL({ dynamic: true }),
          })
          .setTimestamp();

        interaction.reply({ embeds: [embed], ephemeral: true });
        break;
      case 'send':
        const panel = await schema.findOne({ Guild: guild.id, Category: category.id });

        if (!panel) {
          return interaction.reply({ embeds: [ErrorEmbed(`\\❌ There is no ticket panel set to ${category}!`)], ephemeral: true });
        }

        sendPanelEmbed(client, interaction).catch(() => {
          return interaction.reply({ embeds: [ErrorEmbed(`\\❌ An error occurred while sending panel embed to channel. Please try again later.`)], ephemeral: true });
        });

        interaction.reply({ embeds: [SuccessEmbed(`\\✔️ Panel embed sent to ${channel}!`)], ephemeral: true });
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
    .setLabel("Open ticket")
    .setCustomId(`btn_ticket_${category.id}`)
    .setEmoji("📩")
    .setStyle("Primary");
  const row = new ActionRowBuilder().addComponents(button);
  await channel.send({
    embeds: [
      new EmbedBuilder()
        .setColor("Red")
        .setAuthor({
          name: "Tickets",
          iconURL: guild.iconURL({ dynamic: true }),
        })
        .setDescription(
          message ? message :
            `React with 📩 to create your ticket!`
        )
        .setFooter({
          text: `Ticket Panel | \©️${new Date().getFullYear()} Wolfy`,
          iconURL: client.user.avatarURL({ dynamic: true }),
        })
        .setTimestamp()
    ],
    components: [row],
  })
}