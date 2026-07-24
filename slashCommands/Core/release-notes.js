const {
  EmbedBuilder,
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const notes = require("../../schema/releasenotes-Schema");
const { ErrorEmbed } = require("../../util/modules/embeds");
const { colors } = require("../../util/constants/constants");

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
    requiresDatabase: true,
    ownerOnly: true,
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

    switch (sub) {
      case "publish":
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
          await interaction.reply({ embeds: [ErrorEmbed("❌ No release notes found!")] });
        } else {
          await data.forEach(async (value) => {
            const embed = new EmbedBuilder()
              .setColor(colors.BOT)
              .setAuthor({
                name: client.user.username,
                iconURL: client.user.displayAvatarURL({ dynamic: true }),
              })
              .setDescription(
                [
                  `📢 **${client.user.username} - Version ${value.Version}**`,
                  value.Title ? `${value.Title}` : ``,
                  `📝 **Updates:**\n${value.Updates}`,
                  `📅 **Release Date:** <t:${Math.floor(value.Date / 1000)}:F>`,
                ].join("\n\n")
              )
              .setFooter({
                text: `Requested by ${interaction.user.username}`,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
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
