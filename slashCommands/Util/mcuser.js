const discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require("axios");

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "mcuser",
    description: "Gives information about a Minecraft user player!",
    dmOnly: false,
    guildOnly: false,
    cooldown: 0,
    group: "NONE",
    clientPermissions: [
      discord.PermissionsBitField.Flags.EmbedLinks,
      discord.PermissionsBitField.Flags.ReadMessageHistory
    ],
    permissions: [],
    options: [
      {
        type: 3, // STRING
        name: 'query',
        description: 'Enter a player name',
        required: true
      }
    ]
  },
  async execute(client, interaction) {
    const query = interaction.options.getString("query").toLowerCase();

    let user;
    let response;
    try {
      response = await axios.get(
        `https://api.mojang.com/users/profiles/minecraft/${query}`
      );
      user = response.data;
    } catch (error) {
      console.error(error);
      if (error.response) {
        console.error(
          "Server responded with:",
          error.response.status,
          error.response.statusText
        );
        if (error.response.status === 404) {
          return interaction.reply({
            content:
              "<a:pp681:774089750373597185> **|** The specified user was not found!",
          });
        } else {
          return interaction.reply({
            content: `Error: ${error.response.statusText}`,
          });
        }
      } else if (error.request) {
        console.error("No response received from the server");
        return interaction.reply({
          content:
            "No response received from the server. Please try again later.",
        });
      } else {
        console.error("Error setting up the request:", error.message);
        return interaction.reply({
          content: "An unexpected error occurred. Please try again later.",
        });
      }
    }

    if (!user) {
      return interaction.reply({
        content:
          "<a:pp681:774089750373597185> **|** The specified user was not found!",
      });
    }

    let nameHistory;
    /*
      try {

      } catch (err) {
        await interaction.reply({
          content: `\\❌ An unexpected error occurred, while retrieving name history!`,
        });
        throw new Error(err);
      }
      */

    // Build the embed
    const embed = new discord.EmbedBuilder()
      .setAuthor({
        name: interaction.user.tag,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .addFields(
        { name: "Name:", value: `${user.name}`, inline: true },
        {
          name: "Name History:",
          value: nameHistory?.join("\n") || "No name history found!",
          inline: false,
        },
        { name: "UUID:", value: `\`${user.id}\`` },
        {
          name: "Created At:",
          value: new Date(response.created).toLocaleString(),
          inline: true,
        },
        {
          name: "Download:",
          value: `[Download](https://minotar.net/download/${user.name})`,
          inline: true,
        },
        {
          name: "NameMC:",
          value: `[Click Here](https://mine.ly/${user.name}.1)`,
          inline: true,
        }
      )
      .setImage(`https://minotar.net/armor/body/${user.name}/100.png`)
      .setColor("#2c2f33")
      .setThumbnail(`https://minotar.net/helm/${user.name}/100.png`)
      .setTimestamp()
      .setFooter({
        text: user.name + `'s mcuser | \©️${new Date().getFullYear()} Wolfy`,
        iconURL: interaction.guild.iconURL({ dynamic: true }),
      });

    return await interaction.reply({ embeds: [embed] });
  },
};
