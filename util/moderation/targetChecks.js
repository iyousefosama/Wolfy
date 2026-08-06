/**
 * Shared guard-chain helpers for manual (slash command) moderation actions.
 *
 * Every punish command (ban, kick, softban, mute, timeout, warn, voicekick,
 * nickname, ...) used to duplicate the same ~15 lines of target validation:
 * fetch member -> self/bot/owner/developer check -> role hierarchy check ->
 * actionability check. This module consolidates that chain into one function
 * so behaviour (and error messages) stay consistent across commands.
 */

const TEMPLATES = {
  self: (verb) => `❌ | You cannot **${verb}** yourself!`,
  bot: (verb) => `❌ | You cannot **${verb}** me!`,
  owner: (verb) => `❌ | You cannot **${verb}** a server owner!`,
  developer: (verb) => `❌ | You cannot **${verb}** my developer through me!`,
  hierarchy: (verb) => `❌ | You can't **${verb}** that user because he/she has a higher role than yours!`,
  capability: (verb) => `❌ | I couldn't **${verb}** that user!`,
  notFound: () => `❌ | User could not be found! Please ensure the supplied ID is valid.`,
};

/**
 * Per-action guard configuration.
 *
 * - allowEqual: false means the executor must be STRICTLY higher than the
 *   target (preserved for ban/kick). true means an equal role position blocks
 *   the action (matches the rest of the commands).
 * - capability: the GuildMember property (bannable/kickable/moderatable/
 *   manageable) used as an early "can the bot even do this?" exit. null skips
 *   the check (e.g. role-based mute, DB-only warn).
 * - allowSelf: true lets a user act on themselves (only /nickname, where
 *   changing your own nickname is a feature).
 */
const ACTION_CONFIG = {
  ban: { verb: 'ban', allowEqual: false, capability: 'bannable', allowSelf: false },
  kick: { verb: 'kick', allowEqual: false, capability: 'kickable', allowSelf: false },
  softban: { verb: 'softban', allowEqual: true, capability: 'bannable', allowSelf: false },
  mute: { verb: 'mute', allowEqual: true, capability: 'moderatable', allowSelf: false },
  unmute: { verb: 'unmute', allowEqual: true, capability: 'moderatable', allowSelf: false },
  timeout: { verb: 'timeout', allowEqual: true, capability: 'moderatable', allowSelf: false },
  warn: { verb: 'warn', allowEqual: true, capability: null, allowSelf: false },
  voicekick: {
    verb: 'kick from the voice channel',
    allowEqual: true,
    capability: null,
    allowSelf: false,
    messages: {
      self: `❌ | You can't kick yourself!`,
      bot: `❌ | You can't kick me!`,
      owner: `❌ | You can't kick the server owner!`,
      developer: `❌ | You can't kick my developer!`,
      hierarchy: `❌ | You can't kick that user because they have a higher role!`,
    },
  },
  nickname: {
    verb: 'change the nickname of',
    allowEqual: true,
    capability: 'manageable',
    allowSelf: true,
    messages: {
      bot: `❌ | You cannot change my nickname!`,
      owner: `❌ | You cannot change the server owner's nickname!`,
      developer: `❌ | You cannot change my developer's nickname!`,
      hierarchy: `❌ | You can't change the nickname for this user because they have a higher role!`,
      capability: `❌ | I couldn't change the nickname for this user!`,
    },
  },
};

/** Pick the final message for a config + key (custom message overrides template). */
function messageFor(config, key) {
  return (config.messages && config.messages[key]) || TEMPLATES[key](config.verb);
}

/**
 * Resolve the option member. Returns null when the user option is missing or
 * the member is not in the guild.
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').CommandInteraction} interaction
 * @param {string} optionName
 * @returns {Promise<import('discord.js').GuildMember|null>}
 */
async function resolveTargetMember(client, interaction, optionName = 'target') {
  const user = interaction.options.getUser(optionName);
  if (!user) return null;
  return interaction.guild.members.fetch(user.id).catch(() => null);
}

/**
 * Run the full shared guard chain for a moderation action.
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').CommandInteraction} interaction
 * @param {string} action - key of ACTION_CONFIG (e.g. 'ban', 'timeout')
 * @param {object} [options]
 * @param {string} [options.optionName] - option holding the target user (default 'target')
 * @param {import('discord.js').GuildMember} [options.member] - pre-resolved member (skips option lookup)
 * @returns {Promise<{ok: true, member: import('discord.js').GuildMember} | {ok: false, content: string}>}
 */
async function checkModerationTarget(client, interaction, action, options = {}) {
  const { optionName = 'target', member: providedMember } = options;
  const config = ACTION_CONFIG[action];
  if (!config) {
    throw new Error(`Unknown moderation action "${action}"`);
  }

  const member = providedMember ?? (await resolveTargetMember(client, interaction, optionName));
  if (!member) {
    return { ok: false, content: messageFor(config, 'notFound') };
  }

  if (!config.allowSelf && member.id === interaction.user.id) {
    return { ok: false, content: messageFor(config, 'self') };
  }
  if (member.id === client.user.id) {
    return { ok: false, content: messageFor(config, 'bot') };
  }
  if (member.id === interaction.guild.ownerId) {
    return { ok: false, content: messageFor(config, 'owner') };
  }
  if (client.owners && client.owners.includes(member.id)) {
    return { ok: false, content: messageFor(config, 'developer') };
  }

  // The guild owner can always act on members regardless of role position.
  const executor = interaction.member;
  const isOwnerExecuting = executor && executor.id === interaction.guild.ownerId;
  if (!isOwnerExecuting) {
    const executorPos = executor?.roles?.highest?.position ?? 0;
    const targetPos = member.roles?.highest?.position ?? 0;
    if (config.allowEqual ? executorPos <= targetPos : executorPos < targetPos) {
      return { ok: false, content: messageFor(config, 'hierarchy') };
    }
  }

  if (config.capability && member[config.capability] === false) {
    return { ok: false, content: messageFor(config, 'capability') };
  }

  return { ok: true, member };
}

module.exports = {
  ACTION_CONFIG,
  checkModerationTarget,
  resolveTargetMember,
};
