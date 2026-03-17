const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const LevelService = require('../../util/functions/LevelService');

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
  name: "resetxp",
  aliases: ["resetlevel", "clearxp"],
  dmOnly: false,
  guildOnly: true,
  args: false,
  usage: "[@user]",
  group: "admin",
  description: "Reset a user's or the entire server's XP (Admin only)",
  cooldown: 10,
  guarded: false,
  permissions: [PermissionFlagsBits.ManageGuild],
  clientPermissions: [],
  examples: ["", "@user", "all"],

  async execute(client, message, args) {
    const target = args[0];

    // Reset entire server
    if (target?.toLowerCase() === 'all') {
      try {
        await LevelService.resetGuild(message.guild.id);
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor('Red')
              .setTitle('⚠️ Server XP Reset')
              .setDescription('All XP and level data for this server has been reset.')
              .setTimestamp()
          ]
        });
      } catch (err) {
        console.error('[ResetXP] Error:', err);
        return message.reply('❌ Failed to reset server XP.');
      }
    }

    // Reset specific user
    if (target) {
      const targetUser = await message.guild.members.fetch(target.match(/\d{17,19}/)?.[0]).catch(() => null);
      if (!targetUser) {
        return message.reply('❌ Please mention a valid user or use `all` to reset the entire server.');
      }

      try {
        await LevelService.resetUser(message.guild.id, targetUser.id);
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor('Orange')
              .setTitle('✅ User XP Reset')
              .setDescription(`**${targetUser.user.username}**'s XP and level data has been reset.`)
              .setTimestamp()
          ]
        });
      } catch (err) {
        console.error('[ResetXP] Error:', err);
        return message.reply('❌ Failed to reset user XP.');
      }
    }

    // No args provided
    return message.reply(`❌ Usage: \`${client.prefix}resetxp @user\` or \`${client.prefix}resetxp all\``);
  }
};
