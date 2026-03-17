const { EmbedBuilder } = require('discord.js');
const GuildSchema = require('../../schema/GuildSchema');

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
  name: "levelroles",
  aliases: ["lvlroles", "leveledroles", "level-roles"],
  dmOnly: false,
  guildOnly: true,
  args: false,
  usage: "",
  group: "LeveledRoles",
  description: "Show all level roles in the server",
  cooldown: 10,
  guarded: false,
  permissions: [],
  clientPermissions: ["EmbedLinks"],
  examples: [],

  async execute(client, message) {
    try {
      const guildData = await GuildSchema.findOne({ GuildID: message.guild.id });

      if (!guildData?.Mod?.Level?.isEnabled) {
        return message.reply({
          content: `❌ The leveling system is disabled!\nUse \`${client.prefix}leveltoggle\` to enable it.`
        });
      }

      const levelRoles = guildData.Mod.Level.Roles || [];

      if (levelRoles.length === 0) {
        return message.reply('❌ No level roles have been configured yet.');
      }

      // Sort by level
      const sortedRoles = levelRoles.sort((a, b) => a.Level - b.Level);

      // Build role list
      const roleList = await Promise.all(
        sortedRoles.map(async (roleData) => {
          const role = await message.guild.roles.fetch(roleData.RoleId).catch(() => null);
          const roleName = role ? role.name : 'Unknown Role';
          const roleMention = role ? `<@&${role.id}>` : 'Unknown';
          return `**Level ${roleData.Level}** → ${roleMention} (${roleName})`;
        })
      );

      const embed = new EmbedBuilder()
        .setTitle('🏆 Level Roles')
        .setColor('Gold')
        .setDescription(roleList.join('\n'))
        .setFooter({ text: `${levelRoles.length} role(s) configured` })
        .setTimestamp();

      return message.reply({ embeds: [embed] });

    } catch (err) {
      console.error('[LevelRoles] Error:', err);
      return message.reply('❌ Failed to fetch level roles.');
    }
  }
};
