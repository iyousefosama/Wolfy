const { Client, GuildMember, EmbedBuilder, AttachmentBuilder, ChannelType } = require("discord.js");
const schema = require("../../schema/GuildSchema");
const modifier = require(`${process.cwd()}/util/modifier`);
const string = require(`${process.cwd()}/util/string`);
const { GreetingsCard, Font } = require("canvacord");
Font.loadDefault();
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
async function sendCustomEmbed(channel, embedData, member) {
  const title = await modifier.modify(embedData.title || null, member);
  const description = await modifier.modify(embedData.description || "{user} has joined {guildName} server!", member);
  const imageUrl = await modifier.modify(embedData.image?.url || "", member);
  const isValidImage = isValidURL(imageUrl) ? imageUrl : null;
  const thumbnailUrl = await modifier.modify(embedData.thumbnail?.url || "", member);
  const isValidThumbnail = isValidURL(thumbnailUrl) ? thumbnailUrl : null;

  const embed = new EmbedBuilder()
    .setColor(embedData.color || null)
    .setTitle(title)
    .setThumbnail(isValidThumbnail)
    .setDescription(description)
    .setImage(isValidImage)
    .setFooter({ text: `${member.user.username} (${member.user.id})` })
    .setTimestamp();

  await channel.send({
    content: `> Hey, welcome ${member} <a:Up:853495519455215627> `,
    embeds: [embed],
  });
}

/**
 * Sends a greeting card image.
 * @param {TextChannel} channel - The channel to send the image to.
 * @param {GuildMember} member - The member that joined.
 */
async function sendImageCard(channel, member) {
  const card = new GreetingsCard()
    .setMemberCount(member.guild.memberCount)
    .setAvatar(member.displayAvatarURL({ extension: "png", size: 1024 }))
    .setDisplayName(member.user.username)
    .setGuildName(member.guild.name)
    .setType("welcome")
    .setColor("border", "#7289da")
    .setColor("username-box", "#eb403b")
    .setColor("discriminator-box", "#2a2a2b")
    .setColor("message", "#c19a6b")
    .setColor("title", "#e6a54a")
    .setColor("title-border", "#2a2a2b")
    .setColor("background", "#2a2a2b");

  const imageBuffer = await card.build();
  const attachment = new AttachmentBuilder(imageBuffer, { name: "Welcomer.png" });

  await channel.send({
    content: `> Hey, welcome ${member} <a:Up:853495519455215627> `,
    files: [attachment],
  });
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
