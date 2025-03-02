const { logEvent } = require("../../util/logHandler");
const { EmbedBuilder } = require("discord.js");

/** @type {BEV.BaseEvent<"inviteCreate">} */
module.exports = {
  name: "inviteCreate",
  async execute(client, invite) {
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

    logEvent(client, invite.guild, "inviteCreate", inviteCreateEmbed);
  },
};
