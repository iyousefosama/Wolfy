const { logEvent } = require("../../util/logHandler");
const { AuditLogEvent } = require("discord.js");
const discord = require("discord.js");

module.exports = {
  name: "channelCreate",
  async execute(client, channel) {
    if (!channel) return;

    // Fetch audit log
    const fetchedLogs = await channel.guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.ChannelCreate,
    });

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
      15: "Guild Forum",
    };

    if (!channelLog || (!channelLog.available && target.id != channel.id)) return;

    // Create log embed
    const embed = new discord.EmbedBuilder()
      .setAuthor({
        name: executor.username,
        iconURL: executor.displayAvatarURL({ dynamic: true, size: 2048 }),
      })
      .setTitle("<a:Up:853495519455215627> Channel Created!")
      .setDescription(
        `<a:iNFO:853495450111967253> **Channel Name:** ${channel.name}\n<:pp198:853494893439352842> **Channel ID:** \`${channel.id}\`\n\n<:Rules:853495279339569182> **ExecutorTag:** ${executor.tag}\n<:Tag:836168214525509653> **ChannelType:** \`\`\`${types[channel.type]}\`\`\``
      )
      .setColor("#2F3136")
      .setFooter({
        text: channel.guild.name,
        iconURL: channel.guild.iconURL({ dynamic: true }),
      })
      .setTimestamp();

    // Use the new logEvent function
    logEvent(client, channel.guild, "channelCreate", embed);
  },
};
