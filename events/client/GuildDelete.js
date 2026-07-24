const discord = require("discord.js");
const { colors } = require("../../util/constants/constants");
const text = require("../../util/string");
const BEV = require("../../util/types/baseEvents");

/** @type {BEV.BaseEvent<"guildDelete">} */
module.exports = {
  name: "guildDelete",
  async execute(client, guild) {
    if (!guild || !guild.available) {
      return;
    }

    const members = text.commatize(
      client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)
    );
    const botname = client.user.username;
    const botIcon = client.user.displayAvatarURL({
      extension: "png",
      dynamic: true,
      size: 128,
    });
    const guildName = guild?.name;
    const guildIcon = guild?.iconURL({
      dynamic: true,
      extension: "png",
      size: 512,
    });
    const guilds = client.guilds.cache.size;
    const owner = await guild?.fetchOwner().catch(err => {
      console.error("Error fetching guild owner:", err);
      return { displayName: "Unknown", displayAvatarURL: () => "", id: "Unknown" };
    });
    const msg = `😢 I have **left** a \`server\`!`;

    const left = new discord.EmbedBuilder()
      .setAuthor({ name: guildName, iconURL: guildIcon })
      .setColor(colors.ERROR)
      .setThumbnail(guildIcon)
      .setDescription(
        [
          `🏷️ Guild**:** ${guildName}(\`${guild.id}\`)`,
          `👥 Members count**:** ${guild.memberCount}`,
          `\n\`\`\`diff`,
          `- Current guilds: ${guilds}`,
          `- Total members: ${members}`,
          `\`\`\``,
        ].join("\n")
      )
      .setTimestamp()
      .setFooter({
        text: owner.displayName + `(${owner.id})` || "Unknown owner",
        iconURL: owner.displayAvatarURL({ dynamic: true }),
      });

    const debugChannelID = client.config.channels.debug || "877130715337220136";
    const Debug = client.channels.cache.get(debugChannelID);

    if (Debug) {
      setTimeout(async function () {
        try {
          const webhooks = await Debug.fetchWebhooks();
          let webhook = webhooks.find((w) => w.token);

          if (!webhook) {
            if (webhooks.size > 10) {
              await Debug.send("Can't create a new webhook for wolfy!");
              return;
            }
            webhook = await Debug.createWebhook({
              name: botname,
              avatar: botIcon,
            });
          }

          await webhook.send({ content: msg, embeds: [left] });
        } catch (error) {
          console.error("Error sending webhook message:", error);
        }
      }, 10000);
    } else {
      console.error("Debug channel not found.");
    }
  },
};
