const { EmbedBuilder } = require("discord.js")
let Embedlogs = [];

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
        name: "User",
        value: `**${user.username}**(\`${user.id}\`)`,
        inline: true,
      },
      {
        name: "Server",
        value: `**${guild}**${guildId ? `(\`${guildId}\`)` : ""}`,
        inline: true,
      },
      {
        name: "Action Type",
        value: `**${isSlash ? "Slash Command" : "Message"}**`,
        inline: false,
      },
      {
        name: "Action name",
        value: cmdName || "Unknown",
        inline: false,
      }
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

module.exports = {
  commandLog,
  debugLog
}