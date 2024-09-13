const { EmbedBuilder, ChannelType } = require('discord.js');
const schema = require('../../schema/GuildSchema');
const modifier = require(`${process.cwd()}/util/modifier`);
const BEV = require("../../util/types/baseEvents");

const requiredPermissions = [
  "ViewAuditLog",
  "SendMessages",
  "ViewChannel",
  "ReadMessageHistory",
  "EmbedLinks",
];

/** @type {BEV.BaseEvent<"guildMemberRemove">} */
module.exports = {
  name: 'guildMemberRemove',
  async execute(client, member) {
    try {
      const data = await schema.findOne({ GuildID: member.guild.id });
      if (!data || !data.greeter.leaving.isEnabled) return;

      const leave = data.greeter.leaving;
      const Channel = client.channels.cache.get(leave.channel);

      if (!Channel || Channel.type !== ChannelType.GuildText) return;
      if (!Channel.permissionsFor(Channel.guild.members.me).has(requiredPermissions)) return;

      const type = leave.type === 'msg' && !leave.message ? 'default' : leave.type;

      switch (type) {
        case 'default': {
          const embed = new EmbedBuilder()
            .setColor('Red')
            .setTitle(`👋 ${member.user.tag} has left our server!`)
            .setThumbnail(member.user.displayAvatarURL({ extension: 'png', dynamic: true }))
            .setDescription(`**Goodbye ${member}**, sorry to see you go!\n\n<a:pp833:853495989796470815> We are back to \`${member.guild.memberCount}\` members!`)
            .setFooter({ text: `${member.user.username} (${member.user.id})` })
            .setTimestamp();
          return Channel.send({ embeds: [embed] });
        }
        case 'msg': {
          const message = await modifier.modify(leave.message, member);
          return Channel.send(message);
        }
        case 'embed': {
          const title = await modifier.modify(data.leaving.embed.title || null, member);
          const description = await modifier.modify(data.leaving.embed.description || "{user} has left {guildName} server!", member);
          const imageUrl = await modifier.modify(data.leaving.image?.url || "", member);
          const isValidImage = isValidURL(imageUrl) ? imageUrl : null;
          const thumbnailUrl = await modifier.modify(data.leaving.thumbnail?.url || "", member);
          const isValidThumbnail = isValidURL(thumbnailUrl) ? thumbnailUrl : null;

          const embed = new EmbedBuilder()
            .setColor(data.leaving.color || null)
            .setTitle(title)
            .setThumbnail(isValidThumbnail)
            .setImage(isValidImage)
            .setDescription(description)
            .setFooter({ text: `${member.user.username} (${member.user.id})` })
            .setTimestamp();
          return Channel.send({ embeds: [embed] });
        }
        default:
          break;
      }
    } catch (err) {
      console.error(err);
    }
  },
};

/**
 * Checks if a string is a valid URL.
 * @param {string} string - The string to check.
 * @returns {boolean} - True if the string is a valid URL, otherwise false.
 */
function isValidURL(string) {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}
