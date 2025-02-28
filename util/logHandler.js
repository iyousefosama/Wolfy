const discord = require("discord.js");
const schema = require("../schema/GuildSchema");
const { ChannelType } = require("discord.js");
const { sendLogsToWebhook } = require("./functions/client");

const requiredPermissions = [
  "ViewAuditLog",
  "SendMessages",
  "ViewChannel",
  "ReadMessageHistory",
  "EmbedLinks",
];

/**
 * Logs an event to the specified guild's logging channel.
 * @param {import("discord.js").Client} client - The bot client.
 * @param {import("discord.js").Guild} guild - The guild where the event happened.
 * @param {string} logType - The log type (e.g., "channelCreate", "guildMemberUpdate").
 * @param {import("discord.js").EmbedBuilder} embed - The embed message to send.
 */
async function logEvent(client, guild, logType, embed) {
  if (!guild) return;

  let data;
  try {
    data = await schema.findOne({ GuildID: guild.id });
    if (!data || !data.Mod?.Logs?.isEnabled) return;
  } catch (err) {
    console.error(err);
    return;
  }

  // Determine log channel based on logging settings
  const logChannelId = data.Mod.Logs.type === "separated" 
    ? data.Mod.Logs.separated[logType]?.channel 
    : data.Mod.Logs.channel;

  if (data.Mod.Logs.type === "separated" && !data.Mod.Logs.separated[logType]?.isEnabled) {
    return;
  } else if (data.Mod.Logs.type != "separated" && !data.Mod.Logs.isEnabled) {
    return;
  };

  const logChannel = client.channels.cache.get(logChannelId);
  if (!logChannel || logChannel.type !== ChannelType.GuildText) return;

  // Check bot permissions
  const permissions = logChannel.permissionsFor(client.user);
  if (!permissions.has(requiredPermissions)) return;

  // Send the log
  sendLogsToWebhook(client, logChannel, embed);
}

module.exports = { logEvent };
