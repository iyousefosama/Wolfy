const { buildModerationEmbed } = require('../moderation/embeds');
const {
  isExempt, getGuildData, executeAction, sendLogEmbed, sendModerationEmbed,
  containsLeetspeak, isHandled, tryMarkHandled,
} = require('../moderation/core');

/**
 * @param {import('../../struct/Client')} client
 * @param {import('discord.js').Message} message
 * @param {Object | null} guildData
 */
const badWordChecker = async (client, message, guildData = null) => {
  if (!message || !message.guild || message.author.bot || message.author === client.user) return;
  if (isHandled(message)) return;

  const resolved = guildData || await getGuildData(client, message.guild.id);
  if (!resolved?.Mod?.BadWordsFilter?.isEnabled) return;

  const config = resolved.Mod.BadWordsFilter;
  if (isExempt(message, config)) return;

  const bdwList = (config.BDW || []).filter(w => typeof w === 'string' && w.trim().length > 0);
  if (bdwList.length === 0) return;

  const contentLower = message.content.toLowerCase();
  const foundWord = bdwList.find(word => {
    const w = word.toLowerCase();
    return contentLower.includes(w) || containsLeetspeak(message.content, w);
  });

  if (!foundWord) return;

  if (!tryMarkHandled(message)) return;

  const action = config.action || 'delete';
  const reason = `Banned word detected: \`${foundWord}\``;

  const logEmbed = buildModerationEmbed(client, message, {
    title: '🚫 Bad Word Filtered',
    reason, action, moduleName: 'Bad Words Filter',
    content: message.content,
  });
  await sendLogEmbed(message.guild, config.logChannel, logEmbed);

  await executeAction(client, message, action, reason, 'Bad Words Filter');

  await sendModerationEmbed(client, message, {
    title: '🚫 Bad Word Filtered',
    reason, action, moduleName: 'Bad Words Filter',
    autoDelete: 5000,
  });
};

module.exports = badWordChecker;
