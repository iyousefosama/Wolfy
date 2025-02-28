const discord = require('discord.js')
const panelSchema = require("../../schema/Panel-schema");
const { AuditLogEvent } = require('discord.js')
const { logEvent } = require("../../util/logHandler");

/** @type {BEV.BaseEvent<"channelDelete">} */
module.exports = {
  name: 'channelDelete',
  async execute(client, channel) {
    if (!channel) return;

    // Check if it was category & with panel data and delete it
    if(channel.type === 4) {
      return panelSchema.findOneAndDelete({ Category: categoryId });
    }

    const fetchedLogs = await channel.guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.ChannelDelete,
    });
    // Since there's only 1 audit log entry in this collection, grab the first one
    const channelLog = fetchedLogs.entries.first();

    if (!channelLog) return;

    const { executor, target } = channelLog;
    const types = {
      0: "Text Channel",
      2: "Voice Channel",
      4: "CATEGORY",
      5: "Guild Announcement",
      10: "News Thread",
      11: "Public Thread",
      12: "Private Thread",
      13: "Stage Voice",
      15: "Guild Forum"
    }

    if (!channelLog.available && target.id !== channel.id) return;

    const ChannelDeleted = new discord.EmbedBuilder()
      .setAuthor({ name: executor.username, iconURL: executor.displayAvatarURL({ dynamic: true, size: 2048 }) })
      .setTitle('<a:Down:853495989796470815> Channel deleted!')
      .setDescription(`<a:iNFO:853495450111967253> **Channel Name:** ${channel.name}\n<:pp198:853494893439352842> **Channel ID:** \`${channel.id}\`\n\n<:Rules:853495279339569182> **ExecutorTag:** ${executor.tag}\n<:Tag:836168214525509653> **ChannelType:** \`\`\`${types[channel.type]}\`\`\``)
      .setColor('Red')
      .setFooter({ text: channel.guild.name, iconURL: channel.guild.iconURL({ dynamic: true }) })
      .setTimestamp()

    logEvent(client, channel.guild, "channelDelete", ChannelDeleted)
  }
}