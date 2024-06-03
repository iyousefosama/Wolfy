const discord = require("discord.js");
let logs = [];

module.exports = {
  name: "rateLimit",
  isRestEvent: true,
  async execute(client, info) {
    if (!info) {
      return;
    }

    if (!client.config.channels.debug) {
      return;
    } else {
      // Do nothing..
    }

    let output;
    let Channel;
    let _id;

    if (info.path.startsWith("/channels/")) {
      Channel = client.channels.cache.get(
        info.path.replace("/channels/", "").replace("/messages", "")
      );
      if (Channel) {
        console.log("No");
        const _id = Math.random().toString(36).slice(-7);
        Channel.messages.fetch().then(async (messages) => {
          output = messages
            .reverse()
            .map(
              (m) =>
                `${new Date(m.createdAt).toLocaleString("en-US")} - ${
                  m.author.tag
                }(${m.author.id}): ${
                  m.attachments.size > 0
                    ? m.attachments.first().proxyURL
                    : m.content
                }`
            )
            .join("\n");
        });
      } else {
        (Channel = false), (output = false);
      }
    }

    const ratelimit = new discord.EmbedBuilder()
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true, size: 2048 }),
      })
      .setColor("Red")
      .setDescription(
        [
          `\`\`\`js\nTimeout: ${
            info.timeDifference
              ? info.timeDifference
              : info.timeout
              ? info.timeout
              : "Unknown timeout "
          }\n`,
          `Limit: ${info.limit}\n`,
          Channel ? `Channel: ${Channel.name}(${Channel.id})\n` : "",
          Channel ? `Guild: ${Channel.guild.name}(${Channel.guild.id})\n` : "",
          `Global?: ${info.global}`,
          `\n\`\`\``,
        ].join("")
      )
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();
    const Debug = await client.channels.cache.get(client.config.channels.debug);
    const botname = client.user.username;
    logs.push(ratelimit);
    setTimeout(async function () {
      const webhooks = await Debug.fetchWebhooks();
      let webhook = webhooks.filter((w) => w.token).first();
      if (!webhook) {
        webhook = await Debug.createWebhook({
          name: botname,
          avatar: client.user.displayAvatarURL({
            extension: "png",
            dynamic: true,
            size: 128,
          }),
        });
      } else if (webhooks.size <= 10) {
        // Do no thing...
      }
      webhook
        .send({
          content: Channel
            ? `RateLimit from **[${Channel.guild.name}](${Channel.guild.iconURL(
                { dynamic: true }
              )})** - \`#${Channel.name}\`!\r\n\r\n`
            : `RateLimit from bath \`${info.path}\`!`,
          embeds: logs.slice(0, 10).map((log) => log),
          files: [
            {
              attachment: output
                ? Buffer.from(output)
                : Buffer.from("No OutPut!"),
              name: `Ratelimit-${_id}.txt`,
            },
          ],
        })
        .catch(() => {});
      logs = [];
    }, 10000);

    // add more functions on ready  event callback function...

    return;
  },
};
