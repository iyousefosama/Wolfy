const { ActionRowBuilder } = require('discord.js');
const {
  getCategories,
  getCommandsByCategory,
  buildMainMenu,
  buildCategoryEmbed,
  buildAllCommandsEmbed,
  buildCategorySelect,
} = require('../../util/modules/helpBuilder');

module.exports = {
  name: 'help',
  aliases: ['helpme'],
  dmOnly: false,
  guildOnly: false,
  args: false,
  usage: '[category | all]',
  group: 'bot',
  description: 'Display main bot help list embed.',
  cooldown: 5,
  guarded: false,
  permissions: [],
  clientPermissions: ['EmbedLinks'],
  examples: ['all', 'economy', 'fun'],
  async execute(client, message, args) {
    const prefix = client.config.prefix;
    const categoryArg = args.length > 0 ? args.join(' ').toLowerCase().trim() : null;

    // Convert Collection to array
    const textCommands = [...client.commands.values()];

    // Get dynamic categories
    const categories = getCategories(textCommands);

    // ---------- Handle direct category argument ----------
    if (categoryArg) {
      // "all" → full list embed
      if (categoryArg === 'all') {
        const allEmbed = buildAllCommandsEmbed(client, message.author, categories, textCommands, prefix);
        return message.reply({ embeds: [allEmbed] });
      }

      // Try to match the argument to a category (case-insensitive)
      const matched = categories.find(
        (c) => c.toLowerCase().trim() === categoryArg,
      );
      if (matched) {
        const cmds = getCommandsByCategory(textCommands, matched);
        const embed = buildCategoryEmbed(client, matched, cmds, prefix);
        return message.reply({ embeds: [embed] });
      }

      // If no match, fall through to main menu
    }

    // ---------- Main menu with select menu ----------
    const mainEmbed = buildMainMenu(client, message.author, prefix);
    const selectRow = buildCategorySelect(categories, textCommands);

    const msg = await message.reply({
      embeds: [mainEmbed],
      components: [selectRow],
    });

    // ---------- Select menu collector ----------
    const collector = msg.createMessageComponentCollector({
      time: 300_000, // 5 minutes
      filter: (i) => i.user.id === message.author.id,
    });

    collector.on('collect', async (i) => {
      if (!i.isStringSelectMenu()) return;
      const value = i.customId === 'help_category_select' ? i.values[0] : null;
      if (!value) return;

      await i.deferUpdate();

      let newEmbed;
      if (value === '__back__') {
        newEmbed = buildMainMenu(client, message.author, prefix);
      } else if (value === '__all__') {
        newEmbed = buildAllCommandsEmbed(client, message.author, categories, textCommands, prefix);
      } else {
        const cmds = getCommandsByCategory(textCommands, value);
        newEmbed = buildCategoryEmbed(client, value, cmds, prefix);
      }

      // Edit the original message to show the new content
      await msg.edit({
        embeds: [newEmbed],
        components: [selectRow],
      }).catch(() => {
        // Fallback: if editing fails, reply with a new message
        message.reply({ embeds: [newEmbed] }).catch(() => null);
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