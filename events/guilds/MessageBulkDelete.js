const schema = require("../../schema/GuildSchema");
const { ChannelType, EmbedBuilder } = require("discord.js");
const { sendLogsToWebhook } = require("../../util/functions/client");

const BEV = require("../../util/types/baseEvents");

/** @type {BEV.BaseEvent<"messageDeleteBulk">} */
module.exports = {
  name: "messageDeleteBulk",
  async execute(client, messages) {
    const messageArray = Array.from(messages.values());
    const guild = messageArray[0]?.guild;
    if (!guild) return;

    let data;
    try {
      data = await schema.findOne({ GuildID: guild.id });
      if (!data || !data.Mod?.Logs || !data.Mod.Logs.isEnabled) {
        return;
      }
    } catch (err) {
      console.error(`Error fetching guild data for ${guild.id}:`, err);
      return;
    }

    const logChannelId = data.Mod.Logs.channel;
    const logChannel = client.channels.cache.get(logChannelId);

    if (!logChannel || logChannel.type !== ChannelType.GuildText) {
      return;
    }

    const permissions = logChannel.permissionsFor(client.user);
    if (!permissions.has([
      "SendMessages",
      "ViewChannel",
    ])) {
      return;
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const messageContents = messageArray.slice(0, 5).map(msg => {
      const content = msg.content || "❌ No content (e.g., embed or attachment)";
      return `${msg.author.tag}: ${content}`;
    }).join("\n") || "❌ Unknown messages";

    const bulkDeleteEmbed = new EmbedBuilder()
      .setTitle("<a:Down:853495989796470815> Bulk Message Delete")
      .setDescription(`
        **Channel**: ${messageArray[0].channel.name}\n
        **Number of Messages**: ${messages.size}\n
        **Sample**:\n\`\`\`${messageContents}\`\`\`\n
        **At**: <t:${timestamp}>
      `)
      .setColor("Orange")
      .setFooter({
        text: guild.name,
        iconURL: guild.iconURL({ dynamic: true }),
      })
      .setTimestamp();

    try {
      await sendLogsToWebhook(client, logChannel, bulkDeleteEmbed);
    } catch (err) {
      console.error(`Error sending bulk delete log to webhook in guild ${guild.id}:`, err);
    }
  },
};
