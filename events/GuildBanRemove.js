const discord = require('discord.js')
const schema = require('../schema/GuildSchema')
const { AuditLogEvent, ChannelType } = require('discord.js')
const { sendLogsToWebhook } = require("../util/functions/client");

const requiredPermissions = [
  "ViewAuditLog",
  "SendMessages",
  "ViewChannel",
  "ReadMessageHistory",
  "EmbedLinks",
];

const BEV = require("../util/types/baseEvents");

/** @type {BEV.BaseEvent<"guildBanRemove">} */
module.exports = {
  name: 'guildBanRemove',
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
    if (!permissions.has(requiredPermissions)) return;

    const fetchedLogs = await member.guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.MemberBanRemove,
    });

    const unbanLog = fetchedLogs.entries.first();

    if (!unbanLog) {
      return;
    } else {
      //Do nothing..
    }

    const { executor, target } = unbanLog;

    const timestamp = Math.floor(Date.now() / 1000)

    if (!unbanLog.available && target.id != member.user.id) {
      return;
    } else {
      //Do nothing..
    }

    const Unban = new discord.EmbedBuilder()
      .setAuthor({ name: target.username, iconURL: target.displayAvatarURL({ dynamic: true, size: 2048 }) })
      .setTitle('<a:Mod:853496185443319809> Member Unban!')
      .setDescription(`<:Humans:853495153280155668> **Member:** ${target.tag} (\`${target.id}\`)\n<:MOD:836168687891382312> **Executor:** ${executor.tag}\n<a:Right:877975111846731847> **At:** <t:${timestamp}>`)
      .setColor('#ffd167')
      .setFooter({ text: member.guild.name, iconURL: member.guild.iconURL({ dynamic: true }) })
      .setTimestamp()

    sendLogsToWebhook(client, logChannel, Unban);
    // add more functions on ready  event callback function...

    return;
  }
}