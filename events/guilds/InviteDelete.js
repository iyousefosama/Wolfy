const { logEvent } = require("../../util/logHandler");

/** @type {BEV.BaseEvent<"inviteDelete">} */
module.exports = {
  name: "inviteDelete",
  async execute(client, invite) {
    const inviteDeleteEmbed = new EmbedBuilder()
      .setTitle("<a:Down:853495989796470815> Invite Deleted")
      .setDescription([`**Channel**: ${invite.channel.name}`, `**Code**: ${invite.code}`].join("\n"))
      .setColor("Red")
      .setFooter({
        text: invite.guild.name,
        iconURL: invite.guild.iconURL({ dynamic: true }),
      })
      .setTimestamp();

    logEvent(client, invite.guild, "inviteDelete", inviteDeleteEmbed);
  },
};
