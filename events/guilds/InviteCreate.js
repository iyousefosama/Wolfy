const schema = require("../../schema/GuildSchema");
const { ChannelType, EmbedBuilder } = require("discord.js");
const { sendLogsToWebhook } = require("../../util/functions/client");

const BEV = require("../../util/types/baseEvents");

/** @type {BEV.BaseEvent<"inviteCreate">} */
module.exports = {
  name: "inviteCreate",
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

    const inviteCreateEmbed = new EmbedBuilder()
      .setAuthor({
        name: invite.inviter?.username,
        iconURL: invite.inviter?.displayAvatarURL({ dynamic: true, size: 2048 }),
      })
      .setTitle("<a:Up:853495989796470815> Invite Created")
      .setDescription([`**Inviter**: ${invite.inviter?.tag} (${invite.inviter?.id})`,
      `**Channel**: ${invite.channel?.name}`,
      `**Code**: ${invite.code}`,
       `**Uses**: ${invite.uses}/${invite.maxUses}`
      ].join("\n"))
      .setColor("Green")
      .setFooter({
        text: invite.guild?.name,
        iconURL: invite.guild?.iconURL({ dynamic: true }),
      })
      .setTimestamp()
      .setThumbnail(invite.inviter.displayAvatarURL({ dynamic: true }));

    await sendLogsToWebhook(client, logChannel, inviteCreateEmbed);
  },
};
