const discord = require("discord.js");
const minecraftPlayer = require("minecraft-player");

module.exports = {
  name: "mcuser",
  aliases: ["Mcuser", "MCUSER"],
  dmOnly: false, //or false
  guildOnly: false, //or false
  args: true, //or false
  usage: "<player>",
  group: "Informations",
  description: "Get a minecraft player info/skin",
  cooldown: 2, //seconds(s)
  guarded: false, //or false
  permissions: [],
  clientpermissions: [
    discord.PermissionsBitField.Flags.EmbedLinks,
    discord.PermissionsBitField.Flags.AttachFiles,
  ],
  examples: ["Notch"],
  async execute(client, message, args) {
    const query = args.join(" ");

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
          return await message.reply({
            content:
              "<a:pp681:774089750373597185> **|** The specified user was not found!",
          });
        } else {
          return await message.reply({
            content: `Error: ${error.response.statusText}`,
          });
        }
      } else if (error.request) {
        console.error("No response received from the server");
        return await message.reply({
          content:
            "No response received from the server. Please try again later.",
        });
      } else {
        console.error("Error setting up the request:", error.message);
        return await message.reply({
          content: "An unexpected error occurred. Please try again later.",
        });
      }
    }

    if (!user) {
      return await message.reply({
        content:
          "<a:pp681:774089750373597185> **|** The specified user was not found!",
      });
    }

    let nameHistory;
    /*
      try {

      } catch (err) {
        await message.reply({
          content: `\\❌ An unexpected error occurred, while retrieving name history!`,
        });
        throw new Error(err);
      }
      */

    // Build the embed
    const embed = new discord.EmbedBuilder()
      .setAuthor({
        name: message.user.tag,
        iconURL: message.user.displayAvatarURL({ dynamic: true }),
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
        iconURL: message.guild.iconURL({ dynamic: true }),
      });

    return await message.reply({ embeds: [embed] });
  },
};
