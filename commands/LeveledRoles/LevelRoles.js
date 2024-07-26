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
  clientPermissions: ["UseExternalEmojis"],
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

    try {
      const data = await schema.findOne({ GuildID: message.guild.id });

      if (!data) {
        return message.channel.send(`❌ ${message.author}, There are no Level Roles yet!`);
      }

      if (!data.Mod.Level.isEnabled) {
        return message.channel.send({
          content: `❌ **${message.member.displayName}**, The **levels** system is disabled in this server!\nTo enable this feature, use the \`${client.prefix}leveltoggle\` command.`,
        });
      }

      const rolesList = data.Mod.Level.Roles.map(role => role.RoleName);
      const levelsList = data.Mod.Level.Roles.map(role => role.Level);
      const idList = data.Mod.Level.Roles.map(role => role.RoleId);

      if (rolesList.length === 0) {
        return message.channel.send({
          content: `❌ **${message.member.displayName}**, There are no leveled roles in this server!`,
        });
      }

      const tableHeaders = `| Role                | Level | Role ID                |\n|---------------------|-------|------------------------|\n`;
      const tableRows = rolesList.map((role, index) => {
        return `| ${role.padEnd(19)} | ${String(levelsList[index]).padEnd(5)} | ${idList[index].padEnd(22)} |`;
      }).join("\n");

      return message.reply({
        content: `\`\`\`${tableHeaders}${tableRows}\`\`\``
      });

    } catch (err) {
      console.error(err);
      return message.channel.send(`❌ [DATABASE_ERR]: The database responded with error: ${err.name}`);
    }
  },
};
