const { EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const { colors } = require('../constants/constants');

/**
 * Category emoji map — add predictable categories here.
 * Any category not in this map will get a default 📁 emoji.
 * Keys should be the *canonical* group name (lowercase).
 */
const CATEGORY_EMOJIS = {
  information: 'ℹ️',
  search: '🔍',
  utility: '🛠️',
  utilities: '🛠️',
  moderation: '🛡️',
  fun: '🎮',
  setup: '⚙️',
  bot: '🤖',
  core: '🤖',
  level: '⬆️',
  leveledroles: '⬆️',
  economy: '💰',
  ticket: '🎫',
  tickets: '🎫',
  ai: '🧠',
};

/**
 * Groups to hide from the help menu entirely.
 */
const HIDDEN_GROUPS = ['private', 'developer', 'none', 'unspecified', 'testing', 'owner'];

/**
 * Per-category embed accent colours.
 * Keys should be the *canonical* group name (lowercase).
 */
const CATEGORY_COLORS = {
  information: colors.INFORMATION,
  search: colors.INFORMATION,
  utility: colors.UTILITY,
  utilities: colors.UTILITY,
  moderation: colors.MODERATION,
  fun: colors.FUN,
  setup: colors.SETUP,
  bot: colors.BOT,
  core: colors.CORE,
  level: colors.LEVEL,
  leveledroles: colors.LEVEL,
  economy: colors.ECONOMY,
  ticket: colors.UTILITY,
  tickets: colors.UTILITY,
  ai: colors.AI,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function normalizeGroup(group) {
  return (group || '').toLowerCase().trim();
}

function getCategoryEmoji(group) {
  return CATEGORY_EMOJIS[normalizeGroup(group)] || '📁';
}

function getCategoryColor(group) {
  return CATEGORY_COLORS[normalizeGroup(group)] || colors.BOT;
}

/**
 * Convert a group name like "LeveledRoles" or "admin" into a display-friendly
 * "Leveled Roles" / "Admin".
 */
function formatGroupName(group) {
  if (!group) return 'Uncategorized';
  return group
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

/**
 * Extract { name, description, group } from either a slash-command object
 * (has `.data`) or a text-command object.
 */
function extractCommandInfo(cmd) {
  if (cmd.data) {
    return {
      name: cmd.data.name,
      description: cmd.data.description || 'No description',
      group: cmd.data.group || 'Unspecified',
    };
  }
  return {
    name: cmd.name,
    description: cmd.description || 'No description',
    group: cmd.group || 'Unspecified',
  };
}

// ---------------------------------------------------------------------------
// Category / command helpers
// ---------------------------------------------------------------------------

/**
 * Return a sorted array of visible category names extracted from `commands`.
 * @param {Array} commands  Array of command objects (text or slash).
 * @returns {string[]}
 */
function getCategories(commands) {
  const groups = new Set();
  for (const cmd of commands) {
    const { group } = extractCommandInfo(cmd);
    if (!HIDDEN_GROUPS.includes(normalizeGroup(group))) {
      groups.add(group);
    }
  }
  return [...groups].sort((a, b) => {
    const aNorm = normalizeGroup(a);
    const bNorm = normalizeGroup(b);
    const aKnown = CATEGORY_EMOJIS[aNorm] ? 0 : 1;
    const bKnown = CATEGORY_EMOJIS[bNorm] ? 0 : 1;
    if (aKnown !== bKnown) return aKnown - bKnown;
    return formatGroupName(a).localeCompare(formatGroupName(b));
  });
}

/**
 * Filter `commands` to only those belonging to `category`.
 * @param {Array} commands
 * @param {string} category
 * @returns {Array}
 */
function getCommandsByCategory(commands, category) {
  const target = normalizeGroup(category);
  return commands.filter((cmd) => {
    const { group } = extractCommandInfo(cmd);
    return normalizeGroup(group) === target;
  });
}

// ---------------------------------------------------------------------------
// Embed builders
// ---------------------------------------------------------------------------

/**
 * Main menu embed shown when no category is selected.
 * @param {Object} client
 * @param {Object} user - The user who requested help (interaction.user or message.author)
 * @param {string} prefix
 */
function buildMainMenu(client, user, prefix) {
  return new EmbedBuilder()
    .setColor(colors.BOT)
    .setAuthor({
      name: client.user.username,
      iconURL: client.user.displayAvatarURL(),
    })
    .setThumbnail(client.user.displayAvatarURL())
    .setTitle(`Hi ${user.username}, how can I help you?`)
    .setDescription([
      'Select a category from the dropdown below to view available commands.',
      '',
      `✨ Use \`${prefix}feedback\` to report a bug`,
      `📋 Use \`${prefix}help all\` for a full command list`,
    ].join('\n'))
    .setFooter({
      text: `Requested by ${user.username}`,
      iconURL: user.displayAvatarURL(),
    })
    .setTimestamp();
}

/**
 * Embed for a single category showing every command in that category.
 * Always uses a consistent description-based list format.
 */
function buildCategoryEmbed(client, category, commands, prefix) {
  const emoji = getCategoryEmoji(category);
  const color = getCategoryColor(category);
  const displayName = formatGroupName(category);

  const embed = new EmbedBuilder()
    .setColor(color)
    .setAuthor({
      name: client.user.username,
      iconURL: client.user.displayAvatarURL(),
    })
    .setTitle(`${emoji} ${displayName} Commands`)
    .setFooter({
      text: `Requested by ${client.user.username}`,
      iconURL: client.user.displayAvatarURL(),
    })
    .setTimestamp();

  if (commands.length === 0) {
    embed.setDescription('No commands found in this category.');
    return embed;
  }

  // Use a consistent description-based list format for all categories
  const list = commands
    .map((cmd) => {
      const info = extractCommandInfo(cmd);
      return `> **${prefix}${info.name}** — ${info.description}`;
    })
    .join('\n');
  embed.setDescription(list);

  return embed;
}

/**
 * "All commands" embed listing every visible category with its command names.
 * @param {Object} client
 * @param {Object} user - The user who requested help (interaction.user or message.author)
 * @param {string[]} categories
 * @param {Array} commands
 * @param {string} prefix
 */
function buildAllCommandsEmbed(client, user, categories, commands, prefix) {
  const embed = new EmbedBuilder()
    .setColor(colors.BOT)
    .setAuthor({
      name: user.username,
      iconURL: user.displayAvatarURL({ dynamic: true }),
    })
    .setTitle('📋 Full Command List')
    .setDescription(
      `⭐ Use \`${prefix}help <category>\` for details on a specific category.`,
    )
    .setFooter({
      text: `Requested by ${user.username}`,
      iconURL: user.displayAvatarURL({ dynamic: true }),
    })
    .setTimestamp();

  for (const category of categories) {
    const categoryCommands = getCommandsByCategory(commands, category);
    const emoji = getCategoryEmoji(category);
    const names = categoryCommands.map((cmd) => {
      const info = extractCommandInfo(cmd);
      return `\`${info.name}\``;
    });

    embed.addFields({
      name: `${emoji} ${formatGroupName(category)}`,
      value: names.join(', '),
      inline: true,
    });
  }

  return embed;
}

// ---------------------------------------------------------------------------
// Select menu builder
// ---------------------------------------------------------------------------

/**
 * Build a StringSelectMenu row for choosing a category.
 * Includes "Back to Menu" and "All Commands" options at the top.
 */
function buildCategorySelect(categories, commands, customId = 'help_category_select') {
  const select = new StringSelectMenuBuilder()
    .setCustomId(customId)
    .setPlaceholder('Select a command category...');

  const options = [
    {
      label: '🔙 Back to Menu',
      description: 'Return to the main help menu',
      value: '__back__',
    },
    {
      label: '📋 All Commands',
      description: 'View all commands grouped by category',
      value: '__all__',
    },
  ];

  for (const category of categories) {
    const categoryCommands = getCommandsByCategory(commands, category);
    options.push({
      label: `${getCategoryEmoji(category)} ${formatGroupName(category)}`,
      description: `${categoryCommands.length} command${categoryCommands.length !== 1 ? 's' : ''}`,
      value: category,
    });
  }

  select.addOptions(options);

  return new ActionRowBuilder().addComponents(select);
}

module.exports = {
  CATEGORY_EMOJIS,
  HIDDEN_GROUPS,
  normalizeGroup,
  getCategoryEmoji,
  getCategoryColor,
  formatGroupName,
  extractCommandInfo,
  getCategories,
  getCommandsByCategory,
  buildMainMenu,
  buildCategoryEmbed,
  buildAllCommandsEmbed,
  buildCategorySelect,
};
