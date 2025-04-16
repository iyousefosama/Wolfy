const discord = require("discord.js");
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
    cooldown: 2,
    integration_types: [0, 1],
    contexts: [0, 1, 2],
    group: "Utility",
    clientPermissions: ["EmbedLinks", "ReadMessageHistory"],
    permissions: [],
    options: [
      {
        type: 3, // STRING
        name: "query",
        description: "Enter a player name",
        required: true,
      },
    ],
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
            content: client.language.getString("MCUSER_NOT_FOUND", interaction.guild?.id, { user: interaction.user }),
          });
        } else {
          return interaction.reply({
            content: client.language.getString("MCUSER_ERROR", interaction.guild?.id, { user: interaction.user }),
          });
        }
      } else if (error.request) {
        console.error("No response received from the server");
        return interaction.reply({
          content: client.language.getString("MCUSER_ERROR", interaction.guild?.id, { user: interaction.user }),
        });
      } else {
        console.error("Error setting up the request:", error.message);
        return interaction.reply({
          content: client.language.getString("MCUSER_ERROR", interaction.guild?.id, { user: interaction.user }),
        });
      }
    }

    if (!user) {
      return interaction.reply({
        content: client.language.getString("MCUSER_NOT_FOUND", interaction.guild?.id, { user: interaction.user }),
      });
    }

    const year = new Date().getFullYear();
    
    // Build the embed
    const embed = new discord.EmbedBuilder()
      .setAuthor({
        name: interaction.user.tag,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setTitle(client.language.getString("MCUSER_TITLE", interaction.guild?.id, { username: user.name }))
      .addFields(
        { name: client.language.getString("MCUSER_USERNAME", interaction.guild?.id), value: user.name, inline: true },
        { name: client.language.getString("MCUSER_UUID", interaction.guild?.id), value: `\`${user.id}\`` },
        { 
          name: client.language.getString("MCUSER_SKIN", interaction.guild?.id), 
          value: `[${client.language.getString("MCUSER_DOWNLOAD_SKIN", interaction.guild?.id)}](https://minotar.net/download/${user.name})`, 
          inline: true 
        },
        { 
          name: "NameMC:", 
          value: `[${client.language.getString("MCUSER_NAMEMC", interaction.guild?.id)}](https://mine.ly/${user.name}.1)`, 
          inline: true 
        }
      )
      .setImage(`https://minotar.net/armor/body/${user.name}/100.png`)
      .setColor("#2c2f33")
      .setThumbnail(`https://minotar.net/helm/${user.name}/100.png`)
      .setTimestamp()
      .setFooter({
        text: client.language.getString("MCUSER_FOOTER", interaction.guild?.id, { year }),
        iconURL: interaction.guild?.iconURL({ dynamic: true }),
      });

    if (user.legacy) embed.addFields({ name: "Legacy:", value: "Yes", inline: true });
    if (user.demo) embed.addFields({ name: "Demo:", value: "Yes", inline: true });

    return interaction.reply({ embeds: [embed] });
  },
};
