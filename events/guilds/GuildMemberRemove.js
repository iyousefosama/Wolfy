const discord = require('discord.js')
const moment = require("moment");
const { AuditLogEvent } = require('discord.js')
const { logEvent } = require("../../util/logHandler");

/** @type {BEV.BaseEvent<"guildMemberAdd">} */
module.exports = {
  name: 'guildMemberRemove',
  async execute(client, member) {
    if (!member) return;

    const fetchedLogs = await member.guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.MemberKick,
    });
    // Since we only have 1 audit log entry in this collection, we can simply grab the first one
    const kickLog = fetchedLogs.entries.first();

    let RemoveEmbed;

    if (kickLog && kickLog?.createdAt > member.joinedAt && kickLog?.target.id == member.id) {
      const { executor, target } = kickLog;
      RemoveEmbed = new discord.EmbedBuilder()
        .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
        .setTitle('<a:Mod:853496185443319809> Member Kicked!')
        .setDescription(`<a:iNFO:853495450111967253> **MemberTag:** ${member.user.tag} (\`${member.user.id}\`)\n<:MOD:836168687891382312> **Executor:** ${executor.tag}\n<a:Right:877975111846731847> **Created At:** ${moment.utc(member.user.createdAt).format('LT')} ${moment.utc(member.user.createdAt).format('LL')} (\`${moment.utc(member.user.createdAt).fromNow()}\`)\n<a:Right:877975111846731847> **Joined At:** ${moment(member.joinedAt).format("LT")} ${moment(member.joinedAt).format('LL')} (\`${moment(member.joinedAt).fromNow()}\`)`)
        .setColor('#e6a54a')
        .setFooter({ text: member.guild.name, iconURL: member.guild.iconURL({ dynamic: true }) })
        .setTimestamp()
    } else {
      RemoveEmbed = new discord.EmbedBuilder()
        .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
        .setTitle('<a:Down:853495989796470815> Member Leave!')
        .setDescription(`<a:iNFO:853495450111967253> **MemberTag:** ${member.user.tag}\n<:pp198:853494893439352842> **MemberID:** \`${member.user.id}\`\n<a:Right:877975111846731847> **Created At:** ${moment.utc(member.user.createdAt).format('LT')} ${moment.utc(member.user.createdAt).format('LL')} (\`${moment.utc(member.user.createdAt).fromNow()}\`)\n<a:Right:877975111846731847> **Joined At:** ${moment(member.joinedAt).format("LT")} ${moment(member.joinedAt).format('LL')} (\`${moment(member.joinedAt).fromNow()}\`)`)
        .setColor('#2F3136')
        .setFooter({ text: member.guild.name, iconURL: member.guild.iconURL({ dynamic: true }) })
        .setTimestamp()
    }

    logEvent(client, member.guild, "guildMemberRemove", RemoveEmbed)
  }
}