const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const LevelService = require('../../util/functions/LevelService');
const GuildSchema = require('../../schema/GuildSchema');

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
  name: "setlevel",
  aliases: ["setlvl", "levelset"],
  dmOnly: false,
  guildOnly: true,
  args: true,
  usage: "<@user> <level>",
  group: "admin",
  description: "Set a user's level directly (Admin only)",
  cooldown: 5,
  guarded: false,
  permissions: [PermissionFlagsBits.ManageGuild],
  clientPermissions: [],
  examples: ["@user 10", "@user 50"],

  async execute(client, message, args) {
    if (args.length < 2) {
      return message.reply(`❌ Usage: \`${client.prefix}setlevel @user <level>\``);
    }

    const targetUser = await message.guild.members.fetch(args[0].match(/\d{17,19}/)?.[0]).catch(() => null);
    if (!targetUser) {
      return message.reply('❌ Please mention a valid user.');
    }

    const level = parseInt(args[1]);
    if (isNaN(level) || level < 1 || level > 1000) {
      return message.reply('❌ Please provide a valid level between 1 and 1000.');
    }

    try {
      const result = await LevelService.setLevel(message.guild.id, targetUser.id, level);
      
      // Assign level roles if configured
      const guildData = await GuildSchema.findOne({ GuildID: message.guild.id });
      if (guildData?.Mod?.Level?.Roles?.length > 0) {
        await LevelService.assignLevelRoles(targetUser, level, guildData.Mod.Level.Roles);
      }

      const embed = new EmbedBuilder()
        .setColor('Blue')
        .setTitle('✅ Level Updated')
        .setDescription(`**${targetUser.user.username}** is now at **Level ${result.level}**`)
        .addFields(
          { name: 'Current XP', value: `${result.xp}`, inline: true },
          { name: 'Required XP', value: `${result.requiredXp}`, inline: true }
        )
        .setTimestamp();

      return message.reply({ embeds: [embed] });
    } catch (err) {
      console.error('[SetLevel] Error:', err);
      return message.reply('❌ Failed to set level. Please try again.');
    }
  }
};
