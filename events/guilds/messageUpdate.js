const discord = require("discord.js");
const { ChannelType } = require("discord.js");
const { logEvent } = require("../../util/logHandler");
const { wordFilter, linkProtection, antiSpam, antiBot, honeyPot } = require("../../util/functions/moderationUtils");

const BEV = require("../../util/types/baseEvents");

/** @type {BEV.BaseEvent<"messageUpdate">} */
module.exports = {
  name: "messageUpdate",
  async execute(client, oldMessage, newMessage) {
    if (oldMessage.channel.type === ChannelType.DM || !oldMessage.author || oldMessage.author.bot || oldMessage.embeds.length > 0) return;

    // Re-scan edited messages through the auto-moderation system
    if (client.database?.connected && newMessage.guild && newMessage.content !== oldMessage.content) {
      try {
        const data = await client.getCachedGuildData(newMessage.guild.id);
        await wordFilter(client, newMessage, data).catch(() => {});
        await linkProtection(client, newMessage, data).catch(() => {});
        await antiSpam(client, newMessage, data).catch(() => {});
        await antiBot(client, newMessage, data).catch(() => {});
        await honeyPot(client, newMessage, data).catch(() => {});
      } catch (err) {
        console.log(err);
      }
    }

    const file = newMessage.attachments.first()?.url;
    const timestamp = Math.floor(Date.now() / 1000);
    const oldMsg = oldMessage.toString().substr(0, 500);
    const newMsg = newMessage.toString().substr(0, 500);
    const EditedLog = new discord.EmbedBuilder()
      .setAuthor({
        name: oldMessage.author.username,
        iconURL: oldMessage.author.displayAvatarURL({
          dynamic: true,
          size: 2048,
        }),
      })
      .setTitle(`📝 Edited Message`)
      .setDescription(
        `<a:iNFO:853495450111967253> **Member**: \`${oldMessage.author.tag
        }\` (${oldMessage.author.id})\n<:pp198:853494893439352842> **In**: ${oldMessage.channel
        } [Jump to the message](${oldMessage.url
        })\n• **At**: <t:${timestamp}>\n\n<a:Right:877975111846731847> **Old Message**: \`\`\`\n${oldMsg || "❌ Unkown message"
        }\n\`\`\`\n<a:Right:877975111846731847> **New Message**: \`\`\`\n${newMsg || "❌ Unkown message"
        }\n\`\`\``
      )
      .setColor("#2F3136")
      .setFooter({
        text: oldMessage.guild.name,
        iconURL: oldMessage.guild.iconURL({ dynamic: true }),
      })
      .setTimestamp()
      .setImage(file)
      .setThumbnail(oldMessage.author.displayAvatarURL({ dynamic: true }));
      logEvent(client, oldMessage.guild, "messageUpdate", EditedLog)
  },
};
