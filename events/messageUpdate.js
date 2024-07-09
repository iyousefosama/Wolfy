const discord = require("discord.js");
const schema = require("../schema/GuildSchema");
let logs = [];
const { AuditLogEvent, ChannelType } = require("discord.js");

const requiredPermissions = [
  discord.PermissionsBitField.Flags.ViewAuditLog,
  discord.PermissionsBitField.Flags.SendMessages,
  discord.PermissionsBitField.Flags.ViewChannel,
  discord.PermissionsBitField.Flags.ReadMessageHistory,
  discord.PermissionsBitField.Flags.EmbedLinks,
];

const BEV = require("../util/types/baseEvents");

/** @type {BEV.BaseEvent<"messageUpdate">} */
module.exports = {
  name: "messageUpdate",
  async execute(client, oldMessage, newMessage) {
    //if (oldMessage.attachments.size) return;
    if (
      oldMessage.channel.type != ChannelType.GuildText ||
      oldMessage.author == client ||
      !oldMessage.author ||
      oldMessage.embeds[0]
    )
      return;

    const file = newMessage.attachments.first()?.url;

    let data;
    try {
      data = await schema.findOne({
        GuildID: oldMessage.guild.id,
      });
      if (!data) return;
    } catch (err) {
      console.log(err);
    }

    if (!data?.Mod?.Logs) {
      return;
    }

    let Channel = client.channels.cache.get(data.Mod.Logs.channel);
    if (!Channel || !data.Mod.Logs.channel) {
      return;
    } else if (Channel.type !== ChannelType.GuildText) {
      return;
    } else if (!data.Mod.Logs.isEnabled) {
      return;
    } else if (
      !Channel.permissionsFor(Channel.guild.members.me).has(requiredPermissions)
    ) {
      return;
    } else {
      // Do nothing..
    }

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
        `<a:iNFO:853495450111967253> **Member**: \`${
          oldMessage.author.tag
        }\` (${oldMessage.author.id})\n<:pp198:853494893439352842> **In**: ${
          oldMessage.channel
        } [Jump to the message](${
          oldMessage.url
        })\n• **At**: <t:${timestamp}>\n\n<a:Right:877975111846731847> **Old Message**: \`\`\`\n${
          oldMsg || "❌ Unkown message"
        }\n\`\`\`\n<a:Right:877975111846731847> **New Message**: \`\`\`\n${
          newMsg || "❌ Unkown message"
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
    const botname = client.user.username;
    const webhooks = await Channel.fetchWebhooks();
    logs.push(EditedLog);
    setTimeout(async function () {
      let webhook = webhooks.filter((w) => w.token).first();
      if (!webhook) {
        webhook = await Channel.createWebhook({
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
      webhook
        .send({ embeds: logs.slice(0, 10).map((log) => log) })
        .catch(() => {});
      logs = [];
    }, 10000);

    // add more functions on ready  event callback function...

    return;
  },
};
