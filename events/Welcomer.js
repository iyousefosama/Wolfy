const discord = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const schema = require("../schema/GuildSchema");
const modifier = require(`${process.cwd()}/util/modifier`);
const string = require(`${process.cwd()}/util/string`);
const { GreetingsCard, Font } = require("canvacord");
Font.loadDefault();

const { ChannelType } = require("discord.js");
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
  name: "guildMemberAdd",
  async execute(client, member) {
    let data;
    try {
      data = await schema.findOne({
        GuildID: member.guild.id,
      });
      if (!data) return;
    } catch (err) {
      console.log(err);
    }
    let Channel = client.channels.cache.get(data.greeter.welcome.channel);
    let msg;
    if (!Channel || !data.greeter.welcome.channel) {
      return;
    } else if (Channel.type !== ChannelType.GuildText) {
      return;
    } else if (!data.greeter.welcome.isEnabled) {
      return;
    } else if (
      !Channel.permissionsFor(Channel.guild.members.me).has(requiredPermissions)
    ) {
      return;
    } else {
      // Do nothing..
    }

    const welcome = data.greeter.welcome;
    const type =
      welcome.type === "msg" && !welcome.message ? "default" : welcome.type;

    if (type === "default") {
      let embed = new EmbedBuilder()
        .setColor("DarkGreen")
        .setTitle(`${member.user.tag} has joined the server!`)
        .setURL("https://Wolfy.yoyojoe.repl.co")
        .setThumbnail(
          member.user.displayAvatarURL({ extension: "png", dynamic: true })
        )
        .setDescription(
          `Hello ${member}, welcome to **${member.guild.name
          }**!\n\nYou are our **${string.ordinalize(
            member.guild.memberCount
          )}** member!`
        )
        .setFooter({ text: `${member.user.username} (${member.user.id})` })
        .setTimestamp();
      return client.channels.cache.get(data.greeter.welcome.channel).send({
        content: `> Hey, welcome ${member} <a:Up:853495519455215627> `,
        embeds: [embed],
      });
    }

    //if message was text, send the text
    if (type === "msg") {
      const message = await modifier.modify(
        data.greeter.welcome.message,
        member
      );
      return client.channels.cache
        .get(data.greeter.welcome.channel)
        .send(message);
    }

    //if message was embed
    if (type === "embed") {
      const description = await modifier.modify(data.greeter.welcome.embed.description || "{user} has joined {guildName} server!", member);
      const image = data.greeter.welcome.embed.image.url || null;
      const color = data.greeter.welcome.embed.color || null;

      const embed = new discord.EmbedBuilder()
        .setColor(color)
        .setTitle(`${member.user.tag} has joined the server!`)
        .setThumbnail(member.user.displayAvatarURL({ extension: "png", dynamic: true }))
        .setDescription(description)
        .setImage(image)
        .setFooter({ text: `${member.user.username} (${member.user.id})` })
        .setTimestamp();
      return client.channels.cache.get(data.greeter.welcome.channel).send({
        content: `> Hey, welcome ${member} <a:Up:853495519455215627> `,
        embeds: [embed],
      });
    }
    if (type === "image") {
      // create card
      const card = new GreetingsCard()
        .setAvatar("https://cdn.discordapp.com/embed/avatars/0.png")
        .setDisplayName("Wumpus")
        .setType("welcome")
        .setMessage("Welcome to the server!");

      const Card = new GreetingsCard()
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
      await Card.build().then((data) => {
        const attachment = new discord.AttachmentBuilder(data, {
          name: "Welcomer.png",
        });
        return client.channels.cache.get(welcome.channel).send({
          content: `> Hey, welcome ${member} <a:Up:853495519455215627> `,
          files: [attachment],
        });
      });
    }
  },
};
