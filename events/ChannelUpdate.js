const discord = require('discord.js')
const { EmbedBuilder } = require('discord.js')
const schema = require('../schema/GuildSchema')
const { AuditLogEvent, ChannelType } = require('discord.js')
const { sendLogsToWebhook } = require("../util/functions/client");
//const { Permissions } = require('discord.js');

const requiredPermissions = [
  "ViewAuditLog",
  "SendMessages",
  "ViewChannel",
  "ReadMessageHistory",
  "EmbedLinks",
];

const BEV = require("../util/types/baseEvents");

/** @type {BEV.BaseEvent<"channelUpdate">} */
module.exports = {
  name: 'channelUpdate',
  async execute(client, oldChannel, newChannel) {
    if (!oldChannel) return;

    let data;
    try {
      data = await schema.findOne({ GuildID: oldChannel.guild.id });
      if (!data || !data.Mod?.Logs?.isEnabled) return;
    } catch (err) {
      console.error(err);
      return;
    }

    const logChannelId = data.Mod.Logs.type === "separated" ? data.Mod.Logs.separated.channelUpdate.channel : data.Mod.Logs.channel;
    const logChannel = client.channels.cache.get(logChannelId);

    if (!logChannel || logChannel.type !== ChannelType.GuildText) return;

    const permissions = logChannel.permissionsFor(client.user);
    if (!permissions.has(requiredPermissions)) return;

    const fetchedLogs = await oldChannel.guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.ChannelUpdate,
    });
    // Since there's only 1 audit log entry in this collection, grab the first one
    const channelLog = fetchedLogs.entries.first();

    if (!channelLog) {
      return;
    } else {
      //Do nothing..
    }

    const { executor, target, id, name } = channelLog;
    const types = {
      0: "Text Channel",
      2: "Voice Channel",
      4: "CATEGORY",
      5: "Guild Announcement",
      10: "News Thread",
      11: "Public Thread",
      12: "Private Thread",
      13: "Stage Voice",
      15: "Guild Forum"
    }
    if (!channelLog.available && target.id != oldChannel.id) {
      return;
    } else {
      //Do nothing..
    }

    /*
    let oldPermissions = Object.values(oldChannel.permissionOverwrites);
    let mappedPermissions = oldPermissions.map((oldPermission) => {
      let roleOrMember = oldPermission.type === 'role' ? oldChannel.guild.roles.cache.get(oldPermission.id) : oldChannel.guild.members.cache.get(oldPermission.id);
      let oldPermissions = new Permissions(oldPermission.allow).toArray();
      let newPermissions = new Permissions(oldPermission.deny).toArray();
      let changedPermissions = [];

      oldPermissions.forEach(permission => {
        if (!newPermissions.includes(permission)) {
          changedPermissions.push(`❌ ${permission}`);
        }
      });

      newPermissions.forEach(permission => {
        if (!oldPermissions.includes(permission)) {
          changedPermissions.push(`✅ ${permission}`);
        }
      });

      return {
        roleOrMember: roleOrMember,
        changedPermissions: changedPermissions
      };
    });

    let permissionsChanges = mappedPermissions.map(permissionChange => {
      let roleOrMember = permissionChange.roleOrMember;
      let changedPermissions = permissionChange.changedPermissions.join('\n');

      return `${roleOrMember}: \n${changedPermissions}`;
    });
*/


    ChannelUpdate = new EmbedBuilder()
      .setAuthor({ name: executor.username, iconURL: executor.displayAvatarURL({ dynamic: true, size: 2048 }) })
      .setTitle('<a:Mod:853496185443319809> Channel Updated!')
      .setColor('#e6a54a')
      .setFooter({ text: oldChannel.guild.name, iconURL: oldChannel.guild.iconURL({ dynamic: true }) })
      .setTimestamp()
      /*.addFields({name: 'Permissions Changes', value: permissionsChanges.join('\n\n')})*/
      .setDescription([
        `<:pp198:853494893439352842> **Channel:** ${oldChannel.name}(\`${oldChannel.id}\`)\n<:Rules:853495279339569182> **ExecutorTag:** ${executor.tag}\n\n`,
        oldChannel.name !== newChannel.name ? `\`${oldChannel.name}\` **➜** \`${newChannel.name}\`\n` : '',
        oldChannel.type !== newChannel.type ? `<:Tag:836168214525509653> **Old Type:** \`\`\`${types[oldChannel.type]}\`\`\`\n<:Tag:836168214525509653> **New Type:** \`\`\`${types[newChannel.type]}\`\`\`` : ''
      ].join(''));

    sendLogsToWebhook(client, logChannel, ChannelUpdate);
    // add more functions on ready  event callback function...

    return;
  }
}