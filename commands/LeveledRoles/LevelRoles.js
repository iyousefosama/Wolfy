const fs = require("fs");
const discord = require("discord.js");
const schema = require("../../schema/GuildSchema");

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
  name: "levelroles",
  aliases: ["roles", "leveledroles", "level-roles"],
  dmOnly: false,
  guildOnly: true,
  args: false,
  usage: "",
  group: "LeveledRoles",
  description: "Show all level roles in the guild",
  cooldown: 10,
  guarded: false,
  permissions: [],
  clientPermissions: [discord.PermissionsBitField.Flags.UseExternalEmojis],
  examples: [],
  /**
   *
   * @param {import("discord.js").Client} client
   * @param {import("discord.js").Message} message
   * @param {String[]} args
   *
   */
  async execute(client, message, args) {
    message.channel.sendTyping();

    let data;

    try {
      data = await schema.findOne({ GuildID: message.guild.id });

      if (!data) {
        return message.channel.send(
          `❌ ${message.author}, There are no Level Roles yet!`
        );
      }
    } catch (err) {
      console.error(err);
      message.channel.send(
        `❌ [DATABASE_ERR]: The database responded with error: ${err.name}`
      );
    }

    if (!data.Mod.Level.isEnabled) {
      return message.channel.send({
        content: `❌ **${message.member.displayName}**, The **levels** command is disabled in this server!\nTo enable this feature, use the \`${client.prefix}leveltoggle\` command.`,
      });
    }

    const list_Of_Level_Roles = data.Mod.Level.Roles.map(
      (roles) => roles.RoleName
    );
    const list_Of_Levels_To_Reach = data.Mod.Level.Roles.map(
      (roles) => roles.Level
    );
    const list_Of_IDs = data.Mod.Level.Roles.map((roles) => roles.RoleId);

    if (list_Of_Level_Roles.length === 0) {
      return message.channel.send({
        content: `❌ **${message.member.displayName}**, There are no leveled roles in this server!`,
      });
    }

    const successEmbed = new discord.EmbedBuilder()
      .setAuthor({
        name: message.author.username,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      })
      .setFooter({
        text: message.guild.name,
        iconURL: message.guild.iconURL({ dynamic: true }),
      })
      .setDescription(
        `<a:Bagopen:877975110806540379> \`${message.guild.name}\` Leveled Roles List!\n\n`
      )
      .addFields(
        {
          name: "<a:iNFO:853495450111967253> Name",
          value: list_Of_Level_Roles.join("\n"),
          inline: true,
        },
        {
          name: "<a:Right:877975111846731847> Level To Reach",
          value: list_Of_Levels_To_Reach.join("\n"),
          inline: true,
        },
        {
          name: "<:pp198:853494893439352842> ID",
          value: list_Of_IDs.join("\n"),
          inline: true,
        }
      )
      .setColor("DarkGreen")
      .setTimestamp();

    return message.channel.send({ embeds: [successEmbed] });
  },
};
