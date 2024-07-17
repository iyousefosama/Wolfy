const discord = require("discord.js");
const schema = require("../schema/GuildSchema");
const { ChannelType } = require("discord.js");

const BEV = require("../util/types/baseEvents");

/** @type {BEV.BaseEvent<"messageUpdate">} */
module.exports = {
  name: "messageUpdate",
  async execute(client, oldMessage, newMessage) {
    if (oldMessage.channel.type === ChannelType.DM || !oldMessage.author || oldMessage.author.bot || oldMessage.embeds.length > 0) {
      return;
    }

    let data;
    try {
      data = await schema.findOne({ GuildID: oldMessage.guild.id });
      if (!data || !data.Mod?.Logs || !data.Mod.Logs.isEnabled) {
        return;
      }
    } catch (err) {
      console.error(err);
      return;
    }

    const logChannelId = data.Mod.Logs.channel;
    const logChannel = client.channels.cache.get(logChannelId);

    if (!logChannel || logChannel.type !== ChannelType.GuildText) {
      return;
    }

    const permissions = logChannel.permissionsFor(client.user);
    if (!permissions.has([
      "ViewAuditLog",
      "SendMessages",
      "ViewChannel",
    ])) {
      return;
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


    sendLogsToWebhook(client, logChannel, EditedLog);

    // add more functions on ready  event callback function...

    return;
  },
};
