const discord = require("discord.js");
const {
  EmbedBuilder,
  ChannelType,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");
const TicketSchema = require("../../schema/Ticket-Schema");

module.exports = {
  name: "ticketpanel",
  aliases: ["TicketPanel"],
  dmOnly: false, //or false
  guildOnly: true, //or false
  args: false, //or false
  usage: "(Optional: Embed description)",
  group: "Tickets",
  description: "Setup the ticket panel in the server",
  cooldown: 8, //seconds(s)
  guarded: false, //or false
  permissions: [discord.PermissionsBitField.Flags.ManageChannels],
  examples: [""],
  async execute(client, message, args) {
    let text = args.slice(0).join(" ");

    async function MessageInput(message) {
      const filter = (msg) => msg.author.id == message.author.id;

      const msg = await message.channel.awaitMessages({ filter, max: 1 });

      return msg.first().content;
    }

    async function Final(message, embed) {
      const FinallEmb = new discord.EmbedBuilder()
        .setAuthor({
          name: message.author.tag,
          icon: message.author.displayAvatarURL({ dynamic: true, size: 2048 }),
        })
        .setColor("#e6a54a")
        .setDescription(
          `<a:Right:877975111846731847> **${message.author.username}**, What the channel to send the menu to?\n\n<:1_:890489883032952876> Current channel\n<:2_:890489925059887134> Another channel`
        )
        .setFooter({
          text: message.author.tag,
          icon: message.author.displayAvatarURL({ dynamic: true, size: 2048 }),
        })
        .setTimestamp();

      await message.channel.send({ embeds: [FinallEmb], ephemeral: true });

      const msgI = await MessageInput(message);

      if (msgI == "1") {
        return await message.channel.send(embed);
      } else if (msgI == "2") {
        await message.reply({
          content: `**${message.author.username}**, type the channel id!`,
          ephemeral: true,
        });

        let thchannel = await MessageInput(message);

        Embedchannel = message.guild.channels.cache.get(thchannel);

        if (
          !Embedchannel ||
          (Embedchannel.type !== ChannelType.GuildText &&
            Embedchannel.type !== "GUILD_NEWS")
        ) {
          return message.channel.send(
            `\\❌ **${message.member.displayName}**, please provide a valid channel ID.`
          );
        } else if (
          !Embedchannel.permissionsFor(message.guild.members.me).has(
            "SEND_MESSAGES"
          )
        ) {
          return message.channel.send(
            `\\❌ **${message.member.displayName}**, I need you to give me permission to send messages on ${channel} and try again.`
          );
        } else if (
          !Embedchannel.permissionsFor(message.guild.members.me).has(
            discord.PermissionsBitField.Flags.EmbedLinks
          )
        ) {
          return message.channel.send(
            `\\❌ **${message.member.displayName}**, I need you to give me permission to embed links on ${channel} and try again.`
          );
        }

        return await message.channel.send(embed).then(() => {
          message.channel.send(
            `\\✔️ **${message.author}**, Successfully send the \`message\` to ${Embedchannel}!`
          );
        });
      } else {
        return message.reply({
          content: `<:error:888264104081522698>  **|**  That is an invalid response. Please try again.`,
          ephemeral: true,
        });
      }
    }

    async function Embed(message, BtnId = "ticket") {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setAuthor({
          name: "Tickets",
          iconURL: message.guild.iconURL({ dynamic: true }),
        })
        .setDescription(
          [text ? text : `React with 📩 to create your ticket!`].join(" ")
        )
        .setFooter({
          text: `Ticket Panel | \©️${new Date().getFullYear()} Wolfy`,
          iconURL: client.user.avatarURL({ dynamic: true }),
        })
        .setTimestamp();
      const button = new ButtonBuilder()
        .setLabel("Open ticket")
        .setCustomId("ticket")
        .setEmoji("📩")
        .setStyle("Primary");
      const row = new ActionRowBuilder().addComponents(button);

      return {
        embeds: [embed],
        components: [row],
      };
    }

    let data;
    try {
      data = await TicketSchema.findOne({
        guildId: message.guild.id,
        UserId: message.author.id,
      });
      if (!data) {
        data = await TicketSchema.create({
          guildId: message.guild.id,
          UserId: message.author.id,
        });
      }
    } catch (err) {
      console.log(err);
      message.channel.send({
        content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`,
      });
    }

    await message.reply(
      `Do you want to set a tickets category for this panel? \`(y/n)\``
    );

    const filter = (_message) =>
      message.author.id === _message.author.id &&
      ["y", "n", "yes", "no"].includes(_message.content.toLowerCase());
    const proceed = await message.channel
      .awaitMessages({ filter, max: 1, time: 30000, errors: ["time"] })
      .then((collected) =>
        ["y", "yes"].includes(collected.first().content.toLowerCase())
          ? true
          : false
      )
      .catch(() => false);

    if (!proceed) {
      const embed = await Embed(message, "ticket");
      return message.channel.send(embed);
    }

    await message.channel.send(
      `${message.author}, Please type the tickets category id for this panel!`
    );

    const channel = await message.guild.channels.cache.get(
      MessageInput(message)
    );

    if (!channel || channel.type !== ChannelType.GuildCategory) {
      return message.channel.send({
        content: `\\❌ **${message.member.displayName}**, please provide a valid \`CATEGORY\` ID!`,
      });
    } else if (
      !channel
        .permissionsFor(message.guild.members.me)
        .has(discord.PermissionsBitField.Flags.SendMessages)
    ) {
      return message.channel.send({
        content: `\\❌ **${message.member.displayName}**, I need you to give me permission to send messages on ${channel} and try again.`,
      });
    } else if (
      !channel
        .permissionsFor(message.guild.members.me)
        .has(discord.PermissionsBitField.Flags.ManageChannels)
    ) {
      return message.channel.send({
        content: `\\❌ **${message.member.displayName}**, I need you to give me permission to manage channels on ${channel} and try again.`,
      });
    }

    const TicketObject = {
      id: channel.id,
    };

    data.Panels.push(TicketObject);

    await data.save().then(async () => {
      Final(message, Embed(message, `${channel.id}`));
    });

    console.log(data.Panels.length);
  },
};
