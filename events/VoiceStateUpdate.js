const discord = require("discord.js");
const schema = require("../schema/GuildSchema");
let logs = [];
const { AuditLogEvent, ChannelType } = require("discord.js");

const requiredPermissions = [
  "ViewAuditLog",
  "SendMessages",
  "ViewChannel",
  "ReadMessageHistory",
  "EmbedLinks",
];

const BEV = require("../util/types/baseEvents");

/** @type {BEV.BaseEvent<"voiceStateUpdate">} */
module.exports = {
  name: "voiceStateUpdate",
  async execute(client, oldState, newState) {
    if (!oldState) return;

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

    const timestamp = Math.floor(Date.now() / 1000);
    let VoiceUpdate;
    // JOINED
    if (
      !oldState.channelId &&
      newState.channelId &&
      !oldState.channel &&
      newState.channel
    ) {
      VoiceUpdate = new discord.EmbedBuilder()
        .setAuthor({
          name: oldState.member.user.tag,
          iconURL: oldState.member.displayAvatarURL({
            dynamic: true,
            size: 2048,
          }),
        })
        .setDescription(
          `<a:Up:853495519455215627> **${oldState.member} joined the voice channel ${newState.channel}**!`
        )
        .setColor("Green")
        .setFooter({
          text: oldState.guild.name,
          iconURL: oldState.guild.iconURL({ dynamic: true }),
        })
        .setTimestamp();
    }

    // LEFT
    if (
      oldState.channelId &&
      !newState.channelId &&
      oldState.channel &&
      !newState.channel
    ) {
      VoiceUpdate = new discord.EmbedBuilder()
        .setAuthor({
          name: oldState.member.user.tag,
          iconURL: oldState.member.displayAvatarURL({
            dynamic: true,
            size: 2048,
          }),
        })
        .setDescription(
          `<a:Down:853495989796470815> **${oldState.member} left the voice channel ${oldState.channel}**!`
        )
        .setColor("Red")
        .setFooter({
          text: oldState.guild.name,
          iconURL: oldState.guild.iconURL({ dynamic: true }),
        })
        .setTimestamp();
    }

    // MUTE OR DEFEAN
    if (oldState.selfMute === true && newState.selfMute === false) {
      return;
    } else if (oldState.selfMute === false && newState.selfMute === true) {
      return;
    } else if (oldState.selfDeaf === true && newState.selfDeaf === false) {
      return;
    } else if (oldState.selfDeaf === false && newState.selfDeaf === true) {
      return;
    }

    // SWITCH
    if (
      oldState.channelId &&
      newState.channelId &&
      oldState.channel &&
      newState.channel
    ) {
      VoiceUpdate = new discord.EmbedBuilder()
        .setAuthor({
          name: oldState.member.user.tag,
          iconURL: oldState.member.displayAvatarURL({
            dynamic: true,
            size: 2048,
          }),
        })
        .setDescription(
          `<a:Right:877975111846731847> **${oldState.member} switched voice channel ${oldState.channel} ➜ ${newState.channel}**!`
        )
        .setColor("#e6a54a")
        .setFooter({
          text: oldState.guild.name,
          iconURL: oldState.guild.iconURL({ dynamic: true }),
        })
        .setTimestamp();
    }

    sendLogsToWebhook(client, logChannel, VoiceUpdate);
    // add more functions on ready  event callback function...

    return;
  },
};
