const schema = require("../schema/GuildSchema");
const { ChannelType, EmbedBuilder } = require("discord.js");
const { sendLogsToWebhook } = require("../util/functions/client");

const BEV = require("../util/types/baseEvents");

/** @type {BEV.BaseEvent<"inviteDelete">} */
module.exports = {
  name: "inviteDelete",
  async execute(client, invite) {
    let data;
    try {
      data = await schema.findOne({ GuildID: invite.guild.id });
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

    const timestamp = Math.floor(Date.now() / 1000);

    const inviteDeleteEmbed = new EmbedBuilder()
      .setTitle("<a:Down:853495989796470815> Invite Deleted")
      .setDescription(`
        **Channel**: ${invite.channel.name}\n
        **Code**: ${invite.code}\n
      `)
      .setColor("Red")
      .setFooter({
        text: invite.guild.name,
        iconURL: invite.guild.iconURL({ dynamic: true }),
      })
      .setTimestamp();

    await sendLogsToWebhook(client, logChannel, inviteDeleteEmbed);
  },
};
