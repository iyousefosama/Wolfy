const discord = require("discord.js");
const text = require("../util/string");

const BEV = require("../util/types/baseEvents");

/** @type {BEV.BaseEvent<"guildCreate">} */
module.exports = {
  name: "guildCreate",
  async execute(client, guild) {
    if (!guild || !guild.available) {
      return;
    } else {
      // return nothing..
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
    const owner = await guild.fetchOwner();
    const msg = `<:smiling:887894231644004363> I have been **added** to a \`server\`!`;

    const join = new discord.EmbedBuilder()
      .setAuthor({ name: guildName, iconURL: guildIcon })
      .setColor("#77ab59")
      .setThumbnail(guildIcon)
      .setDescription(
        [
          `<a:pp224:853495450111967253> Guild**:** ${guildName}(\`${guild.id}\`)`,
          `<:pp833:853495153280155668> Members count**:** ${guild.memberCount}`,
          `\n\`\`\`diff`,
          `+ Current guilds: ${guilds}`,
          `+ Total members: ${members}`,
          `\`\`\``,
        ].join("\n")
      )
      .setTimestamp()
      .setFooter({
        text: owner.displayName + `(${owner.id})` || "Unknown owner",
        iconURL: owner.displayAvatarURL({ dynamic: true }),
      });
    const Debug =
      (await client.channels.cache.get(client.config.channels.debug)) ||
      (await client.channels.cache.get("877130715337220136"));
    setTimeout(async function () {
      const webhooks = await Debug?.fetchWebhooks();
      let webhook = await webhooks.filter((w) => w.token).first();

      if (!webhook) {
        webhook = await Debug.createWebhook({
          name: botname,
          avatar: botIcon,
        });
      } else if (webhooks.size <= 10) {
        Debug.send("Can't create a new webhook for wolfy!");
        // Do nothing...
      }
      webhook.send({ content: msg, embeds: [join] }).catch(() => {});
    }, 10000);

    return;
  },
};
