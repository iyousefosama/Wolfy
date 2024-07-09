const discord = require("discord.js");
const sb = require("sourcebin");
const { ActionRowBuilder, ButtonBuilder } = require("discord.js");
const fetch = require("node-fetch");

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
  name: "bin",
  aliases: ["Sourcebin", "SOURCEBIN", "sourcebin"],
  dmOnly: false, //or false
  guildOnly: true, //or false
  args: false, //or false
  usage: "<code(or File with the message)>",
  group: "Utilities",
  description: "To upload a code to sourcebin",
  cooldown: 10, //seconds(s)
  guarded: false, //or false
  permissions: [],
  clientPermissions: [
    "EmbedLinks",
    "UseExternalEmojis",
  ],
  examples: ["message.channel.send('Hello, world!')"],
  /**
   *
   * @param {import("discord.js").Client} client
   * @param {import("discord.js").Message} message
   * @param {String[]} args
   *
   */
  async execute(client, message, args) {
    let content;
    message.channel.sendTyping();

    // Get the file's URL
    const file = message.attachments.first()?.url;

    let text;
    if (file) {
      // Fetch the file from the external URL
      const response = await fetch(file);

      // If there was an error send a message with the status
      if (!response.ok) {
        return message.channel.send(
          "There was an error with fetching the file:",
          response.statusText
        );
      }

      // Take the response stream and read it to completion
      text = await response.text();
    }

    if (text) {
      content = text;
    } else if (args.length > 0) {
      content = args.join(" ");
    } else {
      return message.reply(
        `\\❌ **${message.member.displayName}**, Please add the code in the message or the code file!`
      );
    }

    try {
      const value = await sb.create({
        title: `Code published by ${message.author.username}`,
        files: [
          {
            content: content,
            language: "javascript",
          },
        ],
      });

      const embed = new discord.EmbedBuilder()
        .setAuthor({
          name: message.author.username,
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })
        .setTitle("We uploaded your code on sourcebin")
        .setDescription(
          `<a:iNFO:853495450111967253> Click the button to go there!`
        )
        .setColor("Red")
        .setTimestamp()
        .setFooter({
          text: client.user.username,
          iconURL: client.user.displayAvatarURL(),
        });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setStyle("Link")
          .setEmoji("841711383191879690")
          .setURL(`${value.url}`)
          .setLabel("Click Here!")
      );

      message.delete().catch(() => null);
      await message.channel.send({ embeds: [embed], components: [row] });
    } catch (error) {
      console.error("Error creating sourcebin:", error);
      message.channel.send(
        `\\❌ **${message.member.displayName}**, There was an error uploading the code to sourcebin.`
      );
    }
  },
};
