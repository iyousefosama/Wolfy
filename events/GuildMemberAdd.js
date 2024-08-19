const discord = require('discord.js')
const moment = require("moment");
const schema = require('../schema/GuildSchema')
const MuteSchema = require('.././schema/Mute-Schema')
const { ChannelType } = require('discord.js')
const { sendLogsToWebhook } = require("../util/functions/client");

const requiredPermissions = [
  "ViewAuditLog",
  "SendMessages",
  "ViewChannel",
  "ReadMessageHistory",
  "EmbedLinks",
];

const BEV = require("../util/types/baseEvents");

/** @type {BEV.BaseEvent<"guildMemberAdd">} */
module.exports = {
  name: 'guildMemberAdd',
  async execute(client, member) {
    if (!member) return;

    let data;
    let mutedata;
    try {
      data = await schema.findOne({ GuildID: member.guild.id });
      if (!data || !data.Mod?.Logs?.isEnabled) return;
      mutedata = await MuteSchema.findOne({ guildId: member.guild.id, userId: member.id })
    } catch (err) {
      console.error(err);
      return;
    }

    const logChannelId = data.Mod.Logs.type === "separated" ? data.Mod.Logs.separated.memberJoin.channel : data.Mod.Logs.channel;
    const logChannel = client.channels.cache.get(logChannelId);

    if (!logChannel || logChannel.type !== ChannelType.GuildText) return;

    const permissions = logChannel.permissionsFor(client.user);
    if (!permissions.has(requiredPermissions)) return;

    if (mutedata?.Muted == true) {
      let mutedRole = member.guild.roles?.cache.find(roles => roles.name === "Muted")
      member.roles.add(mutedRole, `Wolfy AUTOMUTE`).catch(() => null)
    }

    const Add = new discord.EmbedBuilder()
      .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
      .setTitle('<a:Up:853495519455215627> Member Join!')
      .setDescription(`<a:iNFO:853495450111967253> **MemberTag:** ${member.user.tag}\n<:pp198:853494893439352842> **MemberID:** \`${member.user.id}\`\n<a:Right:877975111846731847> **Created At:** ${moment.utc(member.user.createdAt).format('LT')} ${moment.utc(member.user.createdAt).format('LL')} (\`${moment.utc(member.user.createdAt).fromNow()}\`)\n<a:Right:877975111846731847> **Joined At:** ${moment(member.joinedAt).format("LT")} ${moment(member.joinedAt).format('LL')}`)
      .setColor('Green')
      .setFooter({ text: member.guild.name, iconURL: member.guild.iconURL({ dynamic: true }) })
      .setTimestamp()

    sendLogsToWebhook(client, logChannel, Add);
    // add more functions on ready  event callback function...

    return;
  }
}