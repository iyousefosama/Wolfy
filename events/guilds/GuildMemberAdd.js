const discord = require('discord.js')
const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime");
const MuteSchema = require('../../schema/Mute-Schema')
const { logEvent } = require("../../util/logHandler");
const antiRaid = require('../../util/functions/AntiRaid');

dayjs.extend(relativeTime);

/** @type {BEV.BaseEvent<"guildMemberAdd">} */
module.exports = {
  name: 'guildMemberAdd',
  async execute(client, member) {
    if (!member) return;

    // Run anti-raid protection
    await antiRaid(client, member).catch(err => console.log('Anti-raid error:', err));

    const mutedata = await MuteSchema.findOne({ guildId: member.guild.id, userId: member.id }).catch(() => null);

    // Native timeouts persist across re-joins automatically, so only re-apply the
    // legacy "Muted" role when there is no active timeout (old role-based mutes).
    if (mutedata?.Muted == true && !member.communicationDisabledUntilTimestamp) {
      let mutedRole = member.guild.roles?.cache.find(roles => roles.name === "Muted")
      if (mutedRole) member.roles.add(mutedRole, `Wolfy AUTOMUTE`).catch(() => null)
    }

    const Add = new discord.EmbedBuilder()
      .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
      .setTitle('<a:Up:853495519455215627> Member Join!')
      .setDescription(`<a:iNFO:853495450111967253> **MemberTag:** ${member.user.tag}\n<:pp198:853494893439352842> **MemberID:** \`${member.user.id}\`\n<a:Right:877975111846731847> **Created At:** ${dayjs(member.user.createdAt).format('LT')} ${dayjs(member.user.createdAt).format('LL')} (\`${dayjs(member.user.createdAt).fromNow()}\`)\n<a:Right:877975111846731847> **Joined At:** ${dayjs(member.joinedAt).format("LT")} ${dayjs(member.joinedAt).format('LL')}`)
      .setColor('Green')
      .setFooter({ text: member.guild.name, iconURL: member.guild.iconURL({ dynamic: true }) })
      .setTimestamp()

    logEvent(client, member.guild, "guildMemberAdd", Add);
  }
}