const { EmbedBuilder } = require('discord.js');
const LevelService = require('../../util/functions/LevelService');

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
  name: "levelnotify",
  aliases: ["lvlnotify", "xpalerts"],
  dmOnly: false,
  guildOnly: true,
  args: false,
  usage: "",
  group: "LeveledRoles",
  description: "Toggle level up notifications on/off",
  cooldown: 5,
  guarded: false,
  permissions: [],
  clientPermissions: [],
  examples: [""],

  async execute(client, message) {
    try {
      const notifications = await LevelService.toggleNotifications(message.guild.id, message.author.id);
      
      const embed = new EmbedBuilder()
        .setColor(notifications ? 'Green' : 'Red')
        .setTitle('🔔 Level Notifications')
        .setDescription(
          notifications 
            ? '✅ Level up notifications are now **ENABLED**\nYou will receive a message when you level up.'
            : '❌ Level up notifications are now **DISABLED**\nYou will no longer receive level up messages.'
        )
        .setTimestamp();

      return message.reply({ embeds: [embed] });
    } catch (err) {
      console.error('[LevelNotify] Error:', err);
      return message.reply('❌ Failed to toggle notifications. Please try again.');
    }
  }
};
