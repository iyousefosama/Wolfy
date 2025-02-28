const { AuditLogEvent, ChannelType, EmbedBuilder } = require("discord.js");
const { logEvent } = require("../../util/logHandler");

/** @type {BEV.BaseEvent<"messageDelete">} */
module.exports = {
  name: "messageDelete",
  async execute(client, message) {
    console.log(message.content)
    if (message.channel.type === ChannelType.DM || !message.author || message.author.bot || message.embeds.length > 0) return;

    const fetchedLogs = await message.guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.MessageDelete,
    });
    const messageLog = fetchedLogs.entries.first();
    const executor = messageLog?.executor?.id === message.author.id ? message.author : messageLog?.executor || message.author;

    const timestamp = Math.floor(Date.now() / 1000);
    const messageContent = message.content.substr(0, 500) || "❌ Unknown message";
    const file = message.attachments.first()?.url;

    const deletedLogEmbed = new EmbedBuilder()
      .setAuthor({
        name: message.author.username,
        iconURL: message.author.displayAvatarURL({ dynamic: true, size: 2048 }),
      })
      .setTitle("<a:Down:853495989796470815> Deleted Message")
      .setDescription(`
        <a:iNFO:853495450111967253>  **Member**: ${message.author.tag}(${message.author.id})\n
        ${executor.id != message.author.id ? `**Moderator**: ${executor.tag}(${executor.id})\n` : ""}
        <:pp198:853494893439352842> **In**: ${message.channel}\n
        • **At**: <t:${timestamp}>\n\n<a:Right:877975111846731847>
        **Content**: \`\`\`\n${messageContent || "❌ Unkown message"}\`\`\`\n
      `)
      .setImage(file)
      .setColor("Red")
      .setFooter({
        text: message.guild.name,
        iconURL: message.guild.iconURL({ dynamic: true }),
      })
      .setTimestamp()
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true }));

    logEvent(client, message.guild, "messageDelete", deletedLogEmbed)
  },
};
