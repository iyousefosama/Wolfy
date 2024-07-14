const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  EmbedBuilder,
  ActionRowBuilder,
  Events,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const notes = require("../../schema/releasenotes-Schema");
const { version, author } = require("../../package.json");

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "release-notes",
    description: "View/Publish release notes for wolfy bot",
    dmOnly: false,
    guildOnly: false,
    cooldown: 0,
    group: "Bot",
    clientPermissions: [],
    permissions: [],
    options: [
        {
            type: 1, // SUB_COMMAND
            name: 'publish',
            description: '🛠 Developers only, Publish new release notes'
        },
        {
            type: 1, // SUB_COMMAND
            name: 'view',
            description: 'View the most recent release notes'
        }
    ]
},
  async execute(client, interaction) {
    const { options } = interaction;
    const sub = options.getSubcommand();
    var data = await notes.find();

    async function sendMessage(message) {
      const embed = new EmbedBuilder()
        .setColor(`Blurple`)
        .setDescription(message);

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    async function updateNotes(update, version) {
      await notes.create({
        Updates: update,
        Date: Date.now(),
        Developer: interaction.user.username,
        Version: version,
      });

      await sendMessage("✔ Release notes updated!");
    }

    switch (sub) {
      case "publish":
        if (!client.owners.includes(interaction.user.id)) {
          return interaction.reply({
            content:
              "<a:pp802:768864899543466006> This command is limited for developers only!",
            ephemeral: true,
          });
        }

        // Create the modal
        const modal = new ModalBuilder()
          .setCustomId("modal_notes")
          .setTitle("Publish Release notes");

        // Add components to modal

        // Create the text input component
        const notesInput = new TextInputBuilder()
          .setCustomId("notesInput")
          .setLabel("Type new release notes to publish")
          // Paragraph means multiple lines of text.
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true);

        // An action row only holds one text input,
        // so you need one action row per text input.
        const secondActionRow = new ActionRowBuilder().addComponents(
          notesInput
        );

        // Add inputs to the modal
        modal.addComponents(secondActionRow);

        // Show the modal to the user
        await interaction.showModal(modal);
        break;
      case "view":
        if (data.length == 0) {
          await sendMessage("⚠ No release notes found!");
        } else {
          await data.forEach(async (value) => {
            const embed = new EmbedBuilder()
              .setColor(`#c19a6b`)
              .setAuthor({
                name: "Test",
                iconURL: client.user.displayAvatarURL({ dynamic: true }),
              })
              .setDescription(
                [
                  `<:Discord_Staff:911761250759893012> **${client.user.username}**(\`V: ${value.Version}\`) Changelogs!`,
                  value.Title ? `${value.Title}` : ``,
                  `**Updates:** \n\`\`\`diff\n${value.Updates}\`\`\``,
                  `**Date:** <t:${Math.floor(value.Date / 1000)}:R>`,
                ].join("\n\n")
              )
              .setFooter({
                text: interaction.guild?.name ? interaction.guild.name : client.user.username,
                iconURL: interaction.guild?.iconURL({ dynamic: true }) ? interaction.guild.iconURL({ dynamic: true }) : client.user.displayAvatarURL({ dynamic: true }),
              })
              .setTimestamp();
            return await interaction.reply({
              embeds: [embed],
              ephemeral: true,
            });
          });
        }
        break;
    }
  },
};
