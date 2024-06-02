const { EmbedBuilder } = require("discord.js");
let logs = [];

module.exports = async (client, e, isSlash = false) => {
  const user = e.user ? e.user : e.author;
  const guild = e.guild ? e.guild : "DM";
  const guildId = guild != "DM" ? guild.id : null;
  const Debug =
    (await client.channels.cache.get(client.config.channels.debug)) ||
    (await client.channels.cache.get("1204206801495793735"));
  const cmdName = isSlash
    ? e.commandName
    : e.content.slice(client.config.prefix.length).trim();

  const logEm = new EmbedBuilder()
    .setTitle("System Log")
    .setAuthor({
      name: user.username,
      iconURL: user.displayAvatarURL({ dynamic: true }),
    })
    .setThumbnail(guild != "DM" ? guild.iconURL({ dynamic: true}) : user.displayAvatarURL({ dynamic: true}))
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

  const botname = client.user.username;
  const webhooks = await Debug.fetchWebhooks();
  logs.push(logEm);
  setTimeout(async function () {
    let webhook = webhooks.filter((w) => w.token).first();
    if (!webhook) {
      webhook = await Debug.createWebhook({
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
    while (logs.length > 0) {
      webhook.send({ embeds: logs.slice(0, 10) }).catch(() => {});
      logs = logs.slice(10); // Remove the sent embeds from the logs
    }
  }, 10000);
};
