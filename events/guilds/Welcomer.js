const { Client, GuildMember, EmbedBuilder, AttachmentBuilder, ChannelType } = require("discord.js");
const schema = require("../../schema/GuildSchema");
const modifier = require(`${process.cwd()}/util/modifier`);
const string = require(`${process.cwd()}/util/string`);
const { profileImage } = require("discord-arts");
const BEV = require("../../util/types/baseEvents");

/** @type {BEV.BaseEvent<"guildMemberAdd">} */
module.exports = {
  name: "guildMemberAdd",
  async execute(client, member) {
    try {
      const data = await schema.findOne({ GuildID: member.guild.id });
      if (!data || !data.greeter.welcome.isEnabled) return;

      const channel = client.channels.cache.get(data.greeter.welcome.channel);
      if (!channel || channel.type !== ChannelType.GuildText) return;

      const hasPermissions = channel.permissionsFor(channel.guild.members.me).has([
        "ViewAuditLog",
        "SendMessages",
        "ViewChannel",
        "ReadMessageHistory",
        "EmbedLinks",
      ]);
      if (!hasPermissions) return;

      const { welcome } = data.greeter;
      const type = welcome.type === "msg" && !welcome.message ? "default" : welcome.type;

      switch (type) {
        case "default":
          await sendDefaultEmbed(client, channel, member, welcome);
          break;
        case "msg":
          await sendMessage(channel, welcome.message, member);
          break;
        case "embed":
          await sendCustomEmbed(channel, welcome.embed, member);
          break;
        case "image":
          await sendImageCard(channel, member);
          break;
      }
    } catch (err) {
      client.logDetailedError({
        error: err,
        eventType: "guildMemberAdd",
      })
    }
  },
};

/**
 * Sends the default welcome embed.
 * @param {Client} client - The Discord client instance.
 * @param {TextChannel} channel - The channel to send the message to.
 * @param {GuildMember} member - The member that joined.
 * @param {Object} welcome - The welcome settings.
 */
async function sendDefaultEmbed(client, channel, member, welcome) {
  const embed = new EmbedBuilder()
    .setColor("DarkGreen")
    .setTitle(`${member.user.tag} has joined the server!`)
    .setThumbnail(member.user.displayAvatarURL({ extension: "png", dynamic: true }))
    .setDescription(
      `Hello ${member}, welcome to **${member.guild.name}**!\n\nYou are our **${string.ordinalize(
        member.guild.memberCount
      )}** member!`
    )
    .setFooter({ text: `${member.user.username} (${member.user.id})` })
    .setTimestamp();

  await channel.send({
    content: `> Hey, welcome ${member} <a:Up:853495519455215627> `,
    embeds: [embed],
  });
}

/**
 * Sends a modified message based on the welcome message template.
 * @param {TextChannel} channel - The channel to send the message to.
 * @param {string} messageTemplate - The message template to modify.
 * @param {GuildMember} member - The member that joined.
 */
async function sendMessage(channel, messageTemplate, member) {
  const message = await modifier.modify(messageTemplate, member);
  await channel.send(message);
}

/**
 * Sends a custom embed based on the provided embed settings.
 * @param {TextChannel} channel - The channel to send the message to.
 * @param {Object} embedData - The embed settings from the database.
 * @param {GuildMember} member - The member that joined.
 */
function sendCustomEmbed(channel, embedData, member) {
  const processField = async (value, fallback = null) => 
    value ? await modifier.modify(value, member) : fallback;

  const titlePromise = processField(embedData.title);
  const descriptionPromise = processField(
    embedData.description, 
    "{user} has joined {guildName} server!"
  );
  const imagePromise = processField(embedData.image?.url);
  const thumbnailPromise = processField(embedData.thumbnail?.url, "");

  return Promise.all([titlePromise, descriptionPromise, imagePromise, thumbnailPromise])
    .then(([title, description, imageUrl, thumbnailUrl]) => {
      const embed = new EmbedBuilder()
        .setColor(embedData.color || null)
        .setTitle(title)
        .setDescription(description)
        .setImage(isValidURL(imageUrl) ? imageUrl : null)
        .setThumbnail(isValidURL(thumbnailUrl) ? thumbnailUrl : null)
        .setFooter({ text: `${member.user.username} (${member.user.id})` })
        .setTimestamp();

      return channel.send({
        content: `> Hey, welcome ${member} :Up: `,
        embeds: [embed],
      });
    });
}

/**
 * Sends a greeting card image.
 * @param {TextChannel} channel - The channel to send the image to.
 * @param {GuildMember} member - The member that joined.
 */
async function sendImageCard(channel, member) {
  try {
    const buffer = await profileImage(member.id, {
      customBackground: "https://i.imgur.com/2a2a2b.png",
      borderColor: "#7289da"
    });

    const attachment = new AttachmentBuilder(buffer, { name: "Welcomer.png" });

    await channel.send({
      content: `> Hey, welcome ${member} <a:Up:853495519455215627>\n\nYou are our **${string.ordinalize(member.guild.memberCount)}** member!`,
      files: [attachment],
    });
  } catch (err) {
    console.error('Error generating welcome card:', err);
    // Fallback to text message
    await channel.send({
      content: `> Hey, welcome ${member} <a:Up:853495519455215627>\n\nYou are our **${string.ordinalize(member.guild.memberCount)}** member!`
    });
  }
}

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
