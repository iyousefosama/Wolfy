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
    cooldown: 0,
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
            content: "<a:pp681:774089750373597185> **|** The specified user was not found!",
          });
        } else {
          return interaction.reply({
            content: `Error: ${error.response.statusText}`,
          });
        }
      } else if (error.request) {
        console.error("No response received from the server");
        return interaction.reply({
          content: "No response received from the server. Please try again later.",
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
        content: "<a:pp681:774089750373597185> **|** The specified user was not found!",
      });
    }

    /**
     * Fetch Hypixel player data and add it to the embed.
     * 
     * @param {string} uuid 
     * @param {discord.EmbedBuilder} embed 
     */
    async function fetchHypixelPlayer(uuid, embed) {
      try {
        let response = await axios.get("https://api.hypixel.net/player", {
          headers: {
            "API-Key": "e7d575db-cacc-4158-b3af-e5484410d61c"
          },
          params: { uuid }
        });

        if (response.data.success) {
          let player = response.data.player;
          embed.addFields(
            { name: "Hypixel Rank:", value: player.rank ? player.rank : "Member", inline: true },
            { name: "Hypixel Last Login:", value: `<t:${Math.round(player.lastLogin / 1000)}:R>`, inline: true }
          );
        } else {
          console.error("Failed to fetch player data:", response.data);
        }
      } catch (error) {
        console.error("Error fetching player data:", error);
      }
    }

    // Build the embed
    const embed = new discord.EmbedBuilder()
      .setAuthor({
        name: interaction.user.tag,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .addFields(
        { name: "Name:", value: user.name, inline: true },
        { name: "UUID:", value: `\`${user.id}\`` },
        { name: "Download:", value: `[Download](https://minotar.net/download/${user.name})`, inline: true },
        { name: "NameMC:", value: `[Click Here](https://mine.ly/${user.name}.1)`, inline: true }
      )
      .setImage(`https://minotar.net/armor/body/${user.name}/100.png`)
      .setColor("#2c2f33")
      .setThumbnail(`https://minotar.net/helm/${user.name}/100.png`)
      .setTimestamp()
      .setFooter({
        text: `${user.name}'s mcuser | ©${new Date().getFullYear()} Wolfy`,
        iconURL: interaction.guild.iconURL({ dynamic: true }),
      });

    if (user.legacy) embed.addFields({ name: "Legacy:", value: "Yes", inline: true });
    if (user.demo) embed.addFields({ name: "Demo:", value: "Yes", inline: true });

    await fetchHypixelPlayer(user.id, embed);

    return interaction.reply({ embeds: [embed] });
  },
};
