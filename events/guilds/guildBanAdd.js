const { AuditLogEvent, ChannelType, EmbedBuilder } = require('discord.js');
const schema = require('../../schema/GuildSchema');
const { sendLogsToWebhook } = require('../../util/functions/client');

const BEV = require("../../util/types/baseEvents");

/** @type {BEV.BaseEvent<"guildBanAdd">} */
module.exports = {
  name: 'guildBanAdd',
  async execute(client, member) {
    if (!member) return;

    let data;
    try {
      data = await schema.findOne({ GuildID: member.guild.id });
      if (!data || !data.Mod?.Logs?.isEnabled) return;
    } catch (err) {
      console.error(err);
      return;
    }

    const logChannelId = data.Mod.Logs.channel;
    const logChannel = client.channels.cache.get(logChannelId);

    if (!logChannel || logChannel.type !== ChannelType.GuildText) return;

    const permissions = logChannel.permissionsFor(client.user);
    if (!permissions.has(["ViewAuditLog", "SendMessages", "ViewChannel"])) {
      logChannel.send("Missing permissions").catch(() => {});
      return;
    }
    

    const fetchedLogs = await member.guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.MemberBanAdd,
    });

    const banLog = fetchedLogs.entries.first();
    if (!banLog || banLog.target.id !== member.user.id) return;

    let { executor, target, reason } = banLog;
    reason = reason || "Not specified";
    const timestamp = Math.floor(Date.now() / 1000);

    const BanEmbed = new EmbedBuilder()
      .setAuthor({ name: target.username, iconURL: target.displayAvatarURL({ dynamic: true, size: 2048 }) })
      .setTitle('<a:Mod:853496185443319809> Member Banned!')
      .setDescription(
        `<:Humans:853495153280155668> **Member:** ${target.tag} (\`${target.id}\`)\n` +
        `<:MOD:836168687891382312> **Executor:** ${executor.tag}\n` +
        `<:Rules:853495279339569182> **Reason:** ${reason}\n` +
        `<a:Right:877975111846731847> **At:** <t:${timestamp}>`
      )
      .setColor('#e6a54a')
      .setFooter({ text: member.guild.name, iconURL: member.guild.iconURL({ dynamic: true }) })
      .setTimestamp();

    sendLogsToWebhook(client, logChannel, BanEmbed);
  }
}
