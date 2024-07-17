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

/** @type {BEV.BaseEvent<"guildUpdate">} */
module.exports = {
  name: 'guildUpdate',
  async execute(client, oldGuild, newGuild) {
    if (!oldGuild) return;

    let data;
    try {
      data = await schema.findOne({ GuildID: oldGuild.guild.id });
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


    const fetchedLogs = await oldGuild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.GuildUpdate,
    });

    const guildlog = fetchedLogs.entries.first();

    if (!guildlog) {
      return;
    } else {
      //Do nothing..
    }

    const { executor, target } = guildlog;
    const timestamp = Math.floor(Date.now() / 1000)

    if (!guildlog || target.id != oldGuild.id) {
      return;
    } else {
      //Do nothing..
    }

    const GuildUpdate = new discord.EmbedBuilder()
      .setAuthor({ name: executor.tag + ` (${executor.id})`, iconURL: executor.displayAvatarURL({ dynamic: true, size: 2048 }) })
      .setTitle('📝 Guild Updated!')
      .setDescription([
        oldGuild.name !== newGuild.name ? `Name: \`${oldGuild.name}\` **➜** \`${newGuild.name}\`` : ``,
        oldGuild.region !== newGuild.region ? `Region: \`${oldGuild.region}\` **➜** \`${newGuild.region}\`` : ``,
        oldGuild.icon !== newGuild.icon ? `Icon: [url](${oldGuild.iconURL({ dynamic: true })}) **➜** [url](${newGuild.iconURL({ dynamic: true })})` : ``,
        oldGuild.ownerID !== newGuild.ownerID ? `ownerID: \`${oldGuild.ownerID}\` **➜** \`${newGuild.AuditLogEventownerID}\`` : ``,
        oldGuild.verificationLevel !== newGuild.verificationLevel ? `Verification Level: \`${oldGuild.verificationLevel}\` **➜** \`${newGuild.ownerID}\`` : ``,
        oldGuild.systemChannelID !== newGuild.systemChannelID ? `systemChannelID: \`${oldGuild.systemChannelID}\` **➜** \`${newGuild.systemChannelID}\`` : ``,
        oldGuild.afkChannelID !== newGuild.afkChannelID ? `afkChannelID: \`${oldGuild.afkChannelID}\` **➜** \`${newGuild.afkChannelID}\`` : ``,
        oldGuild.afkTimeout !== newGuild.afkTimeout ? `afkChannelID: \`${oldGuild.afkTimeout}\` **➜** \`${newGuild.afkTimeout}\`` : ``,
        oldGuild.defaultMessageNotifications !== newGuild.defaultMessageNotifications ? `defaultMessageNotifications: \`${oldGuild.defaultMessageNotifications}\` **➜** \`${newGuild.defaultMessageNotifications}\`` : ``,
        `\n\n<:MOD:836168687891382312> **Executor:** ${executor.tag}\n<a:Right:877975111846731847> **At:** <t:${timestamp}>`
      ].join(' '))
      .setThumbnail(oldGuild.icon !== newGuild ? newGuild.iconURL({ dynamic: true }) : null)
      .setColor('#2F3136')
      .setFooter({ text: newGuild.name, iconURL: newGuild.iconURL({ dynamic: true }) })
      .setTimestamp()

    sendLogsToWebhook(client, logChannel, GuildUpdate);

    // add more functions on ready  event callback function...

    return;
  }
}