const { EmbedBuilder } = require('discord.js');
const { buildModerationEmbed } = require('../moderation/embeds');
const {
  isExempt, getGuildData, executeAction, sendLogEmbed, sendModerationEmbed,
  isHandled, tryMarkHandled,
} = require('../moderation/core');

/** The warning channel name used for a honeypot channel */
const HONEY_POT_CHANNEL_NAME = 'honeypot-do-not-send';

/**
 * Send the honey pot announcement embed to the configured channel
 * @param {import('discord.js').Guild} guild
 * @param {string} channelId
 * @param {import('../../struct/Client')} client
 */
async function sendHoneyPotEmbed(client, guild, channelId) {
  const channel = guild.channels.cache.get(channelId);
  if (!channel) return;

  const embed = new EmbedBuilder()
    .setTitle('🍯 HONEY POT CHANNEL')
    .setDescription(
      '**This channel is a trap for scam accounts and bots.**\n\n' +
      'Any account that sends a message here will be automatically **kicked**.\n' +
      'Legitimate members should **never** send messages in this channel.\n\n' +
      'If you are a scammer or bot, you have been warned. 🚫'
    )
    .setColor('#f39c12')
    .setFooter({ text: `Wolfy AutoModeration • ${client.user?.username || 'Wolfy'}`, iconURL: client.user?.displayAvatarURL() })
    .setTimestamp();

  await channel.send({ embeds: [embed] }).catch(() => {});
}

/**
 * Configure a honeypot channel: rename it to warn members, set a warning
 * topic, and post the announcement embed. Call this once when the channel is
 * (re)assigned, never on toggle/save-without-change.
 * @param {import('../../struct/Client')} client
 * @param {import('discord.js').Guild} guild
 * @param {string} channelId
 */
async function setupHoneyPotChannel(client, guild, channelId) {
  const channel = guild.channels.cache.get(channelId);
  if (!channel) return;

  // Rename the channel so everyone is warned not to send messages here
  if (channel.manageable) {
    if (!channel.name.toLowerCase().includes('honeypot')) {
      await channel.setName(HONEY_POT_CHANNEL_NAME, 'Honey pot channel configured by Wolfy AutoModeration').catch(() => {});
    }
    const topic = '🍯 HONEY POT CHANNEL — any message sent here results in an automatic kick/ban. Do NOT send messages in this channel.';
    if (channel.topic !== topic) {
      await channel.setTopic(topic).catch(() => {});
    }
  }

  await sendHoneyPotEmbed(client, guild, channelId);
}

/**
 * @param {import('../../struct/Client')} client
 * @param {import('discord.js').Message} message
 * @param {Object | null} guildData
 */
const honeyPot = async (client, message, guildData = null) => {
  if (!message || !message.guild || message.author.bot || message.author === client.user) return;
  if (isHandled(message)) return;

  const resolved = guildData || await getGuildData(client, message.guild.id);
  if (!resolved?.Mod?.HoneyPot?.isEnabled) return;

  const config = resolved.Mod.HoneyPot;
  if (!config.channel) return;

  // Only trigger in the honey pot channel
  if (message.channel.id !== config.channel) return;

  // Exempt admins/owner
  if (isExempt(message, config)) return;

  if (!tryMarkHandled(message)) return;

  const action = config.action || 'kick';
  const reason = 'Sent a message in the honey pot channel';

  // Log embed
  const logEmbed = buildModerationEmbed(client, message, {
    title: '🍯 Honey Pot Triggered',
    reason, action, moduleName: 'Honey Pot',
    content: message.content || '(attachment / empty message)',
    severity: 'high',
  });
  await sendLogEmbed(message.guild, config.logChannel, logEmbed);

  // Execute action (kick or ban)
  await executeAction(client, message, action, reason, 'Honey Pot');

  // Send notification embed
  await sendModerationEmbed(client, message, {
    title: '🍯 Honey Pot Triggered',
    reason, action, moduleName: 'Honey Pot',
    autoDelete: 5000,
    severity: 'high',
  });

  // DM the user
  try {
    const dmEmbed = new EmbedBuilder()
      .setTitle('🍯 You were caught in a Honey Pot')
      .setDescription(
        `You sent a message in a **honey pot channel** in **${message.guild.name}**.\n\n` +
        `This channel is a trap for scam accounts and bots.\n` +
        `You have been **${action === 'ban' ? 'banned' : 'kicked'}** from the server.`
      )
      .setColor('#e74c3c')
      .setTimestamp();
    await message.author.send({ embeds: [dmEmbed] }).catch(() => {});
  } catch { /* DM failed */ }
};

module.exports = honeyPot;
module.exports.sendHoneyPotEmbed = sendHoneyPotEmbed;
module.exports.setupHoneyPotChannel = setupHoneyPotChannel;
