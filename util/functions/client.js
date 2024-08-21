const { EmbedBuilder } = require("discord.js");
const consoleUtil = require("../../util/console");
let Embedlogs = [];
const logs = new Map();
const sending = new Map(); // Keeps track of which guilds are currently sending logs

/**
 * Sends logs to a Discord webhook
 * @param {import("../../struct/Client")} client the client instance
 * @param {import("discord.js").Channel} channel the channel to send the webhook to
 * @param {EmbedBuilder} embed the embed to log
 */
const sendLogsToWebhook = async (client, channel, embed) => {
  const guildId = channel.guild.id;
  const channelId = channel.id;

  if (!logs.has(guildId)) {
    logs.set(guildId, new Map());
  }
  
  if (!logs.get(guildId).has(channelId)) {
    logs.get(guildId).set(channelId, []);
  }

  if (embed && Object.keys(embed.data).length > 0) {
    logs.get(guildId).get(channelId).push(embed);
  } else {
    console.error("Invalid embed provided");
  }

  if (sending.has(guildId) && sending.get(guildId).has(channelId)) {
    return; // If logs are already being sent for this channel, don't start another timeout
  }

  if (!sending.has(guildId)) {
    sending.set(guildId, new Map());
  }
  
  sending.get(guildId).set(channelId, true);

  setTimeout(async () => {
    const botname = client.user.username;
    const webhooks = await channel.fetchWebhooks();
    let webhook = webhooks.find((w) => w.token);

    if (!webhook) {
      webhook = await channel.createWebhook({
        name: botname,
        avatar: client.user.displayAvatarURL({ extension: "png", dynamic: true, size: 128 }),
      });
    }

    while (logs.get(guildId).get(channelId).length > 0) {
      const embedsToSend = logs.get(guildId).get(channelId).slice(0, 10).filter(embed => Object.keys(embed.data).length > 0);

      if (embedsToSend.length > 0) {
        await webhook.send({ embeds: embedsToSend }).catch(console.error);
      }
      
      logs.get(guildId).set(channelId, logs.get(guildId).get(channelId).slice(10)); // Remove the sent embeds from the logs
    }

    sending.get(guildId).delete(channelId); // Finished sending logs for this channel
    
    // Clean up sending map if empty
    if (sending.get(guildId).size === 0) {
      sending.delete(guildId);
    }
  }, 40000); // 40 seconds delay
};

module.exports = { sendLogsToWebhook };

/**
 * Logging function that logs the interactions users do with Wolfy client
 * @param {import("../struct/Client")} client the client instance
 * @param {import("discord.js").Message | import("discord.js").Interaction} e the event
 * @param {Boolean} isSlash is the event a slash command
 * @param {string} message the console message
 */
const commandLog = async (client, e, isSlash = false, message) => {
  const user = e.user ? e.user : e.author;
  const guild = e.guild ? e.guild : "DM";
  const guildId = guild != "DM" ? guild.id : null;

  /**
   * @type {string}
   */
  const cmdName = isSlash
    ? e.commandName
    : e.content.slice(client.config.prefix.length).trim();

  const logEm = new EmbedBuilder()
    .setTitle("System Log")
    .setAuthor({
      name: user.username,
      iconURL: user.displayAvatarURL({ dynamic: true }),
    })
    .setThumbnail(guild != "DM" ? guild.iconURL({ dynamic: true }) : user.displayAvatarURL({ dynamic: true }))
    .addFields(
      {
        name: "Action Type",
        value: `**${isSlash ? "Slash Command" : "Message"}**`,
        inline: true,
      },
      {
        name: "Action name",
        value: cmdName || "Unknown",
        inline: true,
      },
      {
        name: "User",
        value: `**${user.username}**(\`${user.id}\`)`,
        inline: false,
      },
      {
        name: "Server",
        value: `**${guild}**${guildId ? `(\`${guildId}\`)` : ""}`,
        inline: false,
      },

    )
    .setTimestamp()
    .setFooter({
      text: client.user.username,
      iconURL: client.user.displayAvatarURL({ dynamic: true }),
    })
    .setColor("#2F3136");

  console.log(message);
  client.logs.push(message);

  sendWebhook(client, logEm);
}

/**
 * 
 * @param {import("../../struct/Client")} client 
 * @param {Error} error The error object
 */
const debugLog = async (client, error) => {
  const timezone = 2;
  const offset = 60000 * (new Date().getTimezoneOffset() - (-timezone * 60));
  const time = parseDate(new Date(Date.now() + offset).toLocaleString('EG', { timezone: 'Africa/Egypt' }).split(/:|\s|\//));

  const logEm = new EmbedBuilder()
    .setTitle("System Log")
    .setAuthor({
      name: client.username,
      iconURL: client.user.avatarURL({ dynamic: true }),
    })
    .setDescription(`\\🛠 [\`${error.name}\`] Debug caught!\n\`${time}\`\n\`\`\`xl\n${error.stack.split('\n').splice(0, 5)
      .join('\n').split(process.cwd()).join('MAIN_PROCESS')
      }\n.....\n\`\`\``)
    .setTimestamp()
    .setFooter({
      text: client.user.username,
      iconURL: client.user.displayAvatarURL({ dynamic: true }),
    })
    .setColor("#2F3136");

  client.logs.push(error);

  sendWebhook(client, logEm);
}

/**
 * 
 * @param {import('../../struct/Client')} client 
 * @param {import('discord.js').EmbedBuilder} embed 
 * @returns 
 */
const sendWebhook = async (client, embed) => {
  const channel = client.channels.cache.get(client.config.channels.debug)

  if (!channel) {
    return Promise.resolve(console.error("[sendWebhook fn] error: channel not found"));
  } else {
    // do nothing
  };

  const botname = client.user.username;
  const webhooks = await channel?.fetchWebhooks();
  Embedlogs.push(embed);
  setTimeout(async function () {
    let webhook = await webhooks.filter((w) => w.token).first();

    if (!webhook) {
      webhook = await channel.createWebhook({
        name: botname,
        avatar: client.user.displayAvatarURL({
          extension: "png",
          dynamic: true,
          size: 128,
        }),
      })(botname, {
        avatar: client.user.displayAvatarURL({
          extension: "png",
          dynamic: true,
          size: 128,
        }),
      });
    } else if (webhooks.size <= 10) {
      // Do no thing...
    }
    while (Embedlogs.length > 0) {
      webhook.send({ embeds: Embedlogs.slice(0, 10) }).catch(() => { });
      Embedlogs = Embedlogs.slice(10); // Remove the sent embeds from the logs
    }
  }, 40000);
}

/**
 * logDetailedError function to log detailed errors made by the user.
 * @param {Object} options - The options object for logDetailedError.
 * @param {import('../../struct/Client')} options.client - The client object.
 * @param {Error} options.error - The error object.
 * @param {string} options.eventType - The type of event.
 * @param {import('discord.js').Interaction} [options.interaction] - The interaction object.
 * @param {import('discord.js').Message} [options.message] - The message object.
 * @returns {Promise<void>} - A Promise that resolves once the error is logged.
 */
async function logDetailedError({
  client,
  error,
  eventType,
  interaction = null,
  message = null,
}) {
  const channel = client.channels.cache.get(client.config.channels.debug);
  const timezone = 2;
  const offset = 60000 * (new Date().getTimezoneOffset() - (-timezone * 60));
  const time = parseDate(new Date(Date.now() + offset).toLocaleString('EG', { timezone: 'Africa/Egypt' }).split(/:|\s|\//));

  if (!channel) {
    console.log(`Debug channel not found. Logging error to console: ${error}`);
    return;
  }

  // Extract guild and user based on interaction or message
  const guild = interaction ? interaction.guild : message ? message.guild : null;
  const user = interaction ? interaction.user : message ? message.author : null;

  // Command name based on interaction or message
  const cmdName = interaction ? interaction.commandName : message ? message.content.slice(client.config.prefix.length).trim() : 'Unknown Command';

  consoleUtil.error(`${error.name} caught!\nat ${time}`);
  client.logs.push(`${error.name} caught!\nat ${time}`);

  // Dynamically construct error details based on interaction or message presence
  const details = [
    `**Event Type:** ${eventType}`,
    cmdName ? `**Command:** ${cmdName}` : null,
    guild ? `**Guild:** ${guild.name} (\`${guild.id}\`)` : 'DM',
    user ? `**User:** ${user.tag} (\`${user.id}\`)` : 'Unknown User',
  ]
    .filter(Boolean)
    .join('\n');

  const stackTrace = error.stack.split('\n')
    .slice(0, 5)
    .map(line => line.replace(process.cwd(), 'MAIN_PROCESS'))
    .join('\n');

  const logMessage = `\\🛠 ${error.name} caught!\n\`${time}\`\n${details}\n\`\`\`xl\n${stackTrace}\n.....\n\`\`\``;

  return channel.send(logMessage);
}

/**
 * Parse date
 * @param {Array} dateArray The date array
 * @returns {string} The formatted date
 */
function parseDate([m, d, y, h, min, s, a]) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const weeks = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return `${weeks[new Date(parseInt(y), m - 1, d).getDay()]} ${months[m - 1]} ${d} ${parseInt(y)} ${h == 0 ? 12 : h > 12 ? h - 12 : h}:${min}:${s} ${a ? a : h < 12 ? 'AM' : 'PM'} JST`;
}

module.exports = {
  commandLog,
  debugLog,
  sendLogsToWebhook,
  logDetailedError
}