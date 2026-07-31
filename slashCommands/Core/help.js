const { ActionRowBuilder } = require('discord.js');
const getLocalCommands = require('../../util/helpers/getLocalCommands');
const {
  getCategories,
  getCommandsByCategory,
  buildMainMenu,
  buildCategoryEmbed,
  buildAllCommandsEmbed,
  buildCategorySelect,
} = require('../../util/modules/helpBuilder');

module.exports = {
  data: {
    name: 'help',
    description: 'Shows all available slash commands',
    dmOnly: false,
    guildOnly: false,
    cooldown: 5,
    group: 'Bot',
    integration_types: [0, 1],
    contexts: [0, 1, 2],
    clientPermissions: ['EmbedLinks'],
    permissions: [],
    options: [
      {
        type: 3, // STRING
        name: 'category',
        description: 'Command category to show (or "all" for everything)',
        required: false,
      },
    ],
  },
  async execute(client, interaction) {
    const { options, user } = interaction;
    const categoryArg = options.getString('category');
    const prefix = '/';

    // Load slash commands
    const slashCommands = getLocalCommands('/slashCommands');

    // Get dynamic categories
    const categories = getCategories(slashCommands);

    // ---------- Handle direct category argument ----------
    if (categoryArg) {
      const lowerArg = categoryArg.toLowerCase().trim();

      // "all" → full list embed
      if (lowerArg === 'all') {
        const allEmbed = buildAllCommandsEmbed(client, interaction.user, categories, slashCommands, prefix);
        return interaction.reply({ embeds: [allEmbed], flags: ['Ephemeral'] });
      }

      // Try to match the argument to a category (case-insensitive)
      const matched = categories.find(
        (c) => c.toLowerCase().trim() === lowerArg,
      );
      if (matched) {
        const cmds = getCommandsByCategory(slashCommands, matched);
        const embed = buildCategoryEmbed(client, matched, cmds, prefix);
        return interaction.reply({ embeds: [embed], flags: ['Ephemeral'] });
      }

      // If no match, show main menu
    }

    // ---------- Main menu with select menu ----------
    const mainEmbed = buildMainMenu(client, interaction.user, prefix);
    const selectRow = buildCategorySelect(categories, slashCommands);

    const msg = await interaction.reply({
      embeds: [mainEmbed],
      components: [selectRow],
      fetchReply: true,
    });

    // ---------- Select menu collector ----------
    const collector = msg.createMessageComponentCollector({
      time: 300_000, // 5 minutes
      filter: (i) => i.user.id === interaction.user.id,
    });

    collector.on('collect', async (i) => {
      if (!i.isStringSelectMenu()) return;
      const value = i.customId === 'help_category_select' ? i.values[0] : null;
      if (!value) return;

      await i.deferUpdate();

      let newEmbed;
      if (value === '__back__') {
        newEmbed = buildMainMenu(client, interaction.user, prefix);
      } else if (value === '__all__') {
        newEmbed = buildAllCommandsEmbed(client, interaction.user, categories, slashCommands, prefix);
      } else {
        const cmds = getCommandsByCategory(slashCommands, value);
        newEmbed = buildCategoryEmbed(client, value, cmds, prefix);
      }

      // Edit the original message to show the new content
      await i.editReply({
        embeds: [newEmbed],
        components: [selectRow],
      }).catch(() => {
        // Fallback: if editing fails, reply with a new ephemeral message
        i.followUp({ embeds: [newEmbed], flags: ['Ephemeral'] }).catch(() => null);
      });
    });

    collector.on('end', async () => {
      // Disable the select menu when the collector expires
      const disabledRow = ActionRowBuilder.from(selectRow);
      disabledRow.components.forEach((c) => c.setDisabled(true));
      msg.edit({ components: [disabledRow] }).catch(() => null);
    });
  },
};