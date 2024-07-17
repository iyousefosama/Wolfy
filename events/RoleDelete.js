const discord = require("discord.js");
const schema = require("../schema/GuildSchema");
const { AuditLogEvent, ChannelType } = require("discord.js");
const { sendLogsToWebhook } = require("../util/functions/client");

const requiredPermissions = [
  "ViewAuditLog",
  "SendMessages",
  "ViewChannel",
  "ReadMessageHistory",
  "EmbedLinks",
];

const BEV = require("../util/types/baseEvents");

/** @type {BEV.BaseEvent<"roleDelete">} */
module.exports = {
  name: "roleDelete",
  async execute(client, role) {
    if (!role) return;

    let data;
    try {
      data = await schema.findOne({ GuildID: role.guild.id });
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

    const fetchedLogs = await role.guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.RoleDelete,
    });
    // Since there's only 1 audit log entry in this collection, grab the first one
    const rolelog = fetchedLogs.entries.first();

    if (!rolelog) {
      return;
    } else {
      //Do nothing..
    }

    const { executor, target, id, name, color } = rolelog;

    if (!rolelog || (!rolelog.available && target.id != role.id)) {
      return;
    } else {
      //Do nothing..
    }

    const RoleDeleted = new discord.EmbedBuilder()
      .setAuthor({
        name: executor.username,
        iconURL: executor.displayAvatarURL({ dynamic: true, size: 2048 }),
      })
      .setTitle("<a:Down:853495989796470815> Role Deleted!")
      .setDescription(
        `<a:iNFO:853495450111967253> **Role Name:** ${role.name}\n<:pp198:853494893439352842> **Role ID:** \`${role.id}\`\n<a:Right:877975111846731847> **Role Color:** ${role.color}\n\n<:Rules:853495279339569182> **ExecutorTag:** ${executor.tag}`
      )
      .setColor(role.color || "#2F3136")
      .setFooter({
        text: role.guild.name,
        iconURL: role.guild.iconURL({ dynamic: true }),
      })
      .setTimestamp();

    sendLogsToWebhook(client, logChannel, RoleDeleted);
    // add more functions on ready  event callback function...

    return;
  },
};
