const discord = require('discord.js')
const { AuditLogEvent } = require('discord.js')
const { logEvent } = require("../../util/logHandler");

/** @type {BEV.BaseEvent<"guildBanRemove">} */
module.exports = {
  name: 'guildBanRemove',
  async execute(client, member) {
    if (!member) return;

    const fetchedLogs = await member.guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.MemberBanRemove,
    });

    const unbanLog = fetchedLogs.entries.first();

    if (!unbanLog) return;

    const { executor, target } = unbanLog;

    const timestamp = Math.floor(Date.now() / 1000)

    if (!unbanLog.available && target.id != member.user.id) return;

    const Unban = new discord.EmbedBuilder()
      .setAuthor({ name: target.username, iconURL: target.displayAvatarURL({ dynamic: true, size: 2048 }) })
      .setTitle('<a:Mod:853496185443319809> Member Unban!')
      .setDescription(`<:Humans:853495153280155668> **Member:** ${target.tag} (\`${target.id}\`)\n<:MOD:836168687891382312> **Executor:** ${executor.tag}\n<a:Right:877975111846731847> **At:** <t:${timestamp}>`)
      .setColor('#ffd167')
      .setFooter({ text: member.guild.name, iconURL: member.guild.iconURL({ dynamic: true }) })
      .setTimestamp()

    logEvent(client, member.guild, "guildBanRemove", Unban);
  }
}