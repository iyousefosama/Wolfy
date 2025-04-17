const discord = require("discord.js");
const axios = require("axios");
const { ErrorEmbed } = require("../../util/modules/embeds");

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
    try {
      const response = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${query}`);
      user = response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return interaction.reply({
          embeds: [ErrorEmbed(client.language.getString("MCUSER_NOT_FOUND", interaction.guild?.id, { name: query }))],
        });
      } else {
        return interaction.reply({
          content: client.language.getString("MCUSER_ERROR", interaction.guild?.id, { user: interaction.user }),
        });
      }
    }

    const year = new Date().getFullYear();

    let capeUrl;
    try {
      const sessionRes = await axios.get(`https://sessionserver.mojang.com/session/minecraft/profile/${user.id}`);
      const texturesProperty = sessionRes.data.properties.find(prop => prop.name === "textures");

      const textureData = JSON.parse(Buffer.from(texturesProperty.value, "base64").toString());
      capeUrl = textureData.textures?.CAPE?.url;

    } catch (e) {
      throw new Error("Failed to fetch cape data");
    }

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
          inline: true,
        },
        {
          name: "NameMC:",
          value: `[${client.language.getString("MCUSER_NAMEMC", interaction.guild?.id)}](https://mine.ly/${user.name}.1)`,
          inline: true,
        }
      )
      .setImage(`https://visage.surgeplay.com/full/512/${user.id}.png`)
      .setThumbnail(`https://minotar.net/helm/${user.name}/100.png`)
      .setColor("#2c2f33")
      .setTimestamp()
      .setFooter({
        text: client.language.getString("MCUSER_FOOTER", interaction.guild?.id, { year }),
        iconURL: interaction.guild?.iconURL({ dynamic: true }),
      });

    if (user.legacy) embed.addFields({ name: "Legacy:", value: "Yes", inline: true });
    if (user.demo) embed.addFields({ name: "Demo:", value: "Yes", inline: true });

    /*
    if (capeUrl) {
      embed.addFields({ name: "Cape", value: `[View cape](${capeUrl})`, inline: false });
    }
*/

    return interaction.reply({
      embeds: [embed],
    });
  },
};
