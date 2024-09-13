const discord = require("discord.js");
const schema = require("../../schema/GuildSchema");
const { AuditLogEvent, ChannelType } = require("discord.js");
const { sendLogsToWebhook } = require("../../util/functions/client");

const requiredPermissions = [
  "ViewAuditLog",
  "SendMessages",
  "ViewChannel",
  "ReadMessageHistory",
  "EmbedLinks",
];

const BEV = require("../../util/types/baseEvents");

/** @type {BEV.BaseEvent<"channelCreate">} */
module.exports = {
  name: "channelCreate",
  async execute(client, channel) {
    if (!channel) return;

    let data;
    try {
      data = await schema.findOne({ GuildID: channel.guild.id });
      if (!data || !data.Mod?.Logs?.isEnabled) return;
    } catch (err) {
      console.error(err);
      return;
    }

    const logChannelId = data.Mod.Logs.type === "separated" ? data.Mod.Logs.separated.channelCreate.channel : data.Mod.Logs.channel;
    const logChannel = client.channels.cache.get(logChannelId);

    if (!logChannel || logChannel.type !== ChannelType.GuildText) return;

    const permissions = logChannel.permissionsFor(client.user);
    if (!permissions.has(requiredPermissions)) return;

    const fetchedLogs = await channel.guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.ChannelCreate,
    });
    // Since there's only 1 audit log entry in this collection, grab the first one
    const channelLog = fetchedLogs.entries.first();

    if (!channelLog) {
      return;
    } else {
      //Do nothing..
    }

    const { executor, target, type, id, name } = channelLog;
    const types = {
      0: "Text Channel",
      2: "Voice Channel",
      4: "CATEGORY",
      5: "Guild Announcement",
      10: "News Thread",
      11: "Public Thread",
      12: "Private Thread",
      13: "Stage Voice",
      15: "Guild Forum",
    };
    if (!channelLog || (!channelLog.available && target.id != channel.id)) {
      return;
    } else {
      //Do nothing..
    }

    const ChannelCreate = new discord.EmbedBuilder()
      .setAuthor({
        name: executor.username,
        iconURL: executor.displayAvatarURL({ dynamic: true, size: 2048 }),
      })
      .setTitle("<a:Up:853495519455215627> Channel Created!")
      .setDescription(
        `<a:iNFO:853495450111967253> **Channel Name:** ${channel.name
        }\n<:pp198:853494893439352842> **Channel ID:** \`${channel.id
        }\`\n\n<:Rules:853495279339569182> **ExecutorTag:** ${executor.tag
        }\n<:Tag:836168214525509653> **ChannelType:** \`\`\`${types[channel.type]
        }\`\`\``
      )
      .setColor("#2F3136")
      .setFooter({
        text: channel.guild.name,
        iconURL: channel.guild.iconURL({ dynamic: true }),
      })
      .setTimestamp();

    sendLogsToWebhook(client, logChannel, ChannelCreate);
  },
};
