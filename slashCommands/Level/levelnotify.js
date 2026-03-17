const { EmbedBuilder } = require('discord.js');
const LevelService = require('../../util/functions/LevelService');

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "levelnotify",
    description: "Toggle level up notifications on/off",
    group: "Level",
    requiresDatabase: true,
    clientPermissions: [],
    guildOnly: true,
    options: []
  },

  async execute(client, interaction) {
    await interaction.deferReply({ ephemeral: true });

    try {
      const notifications = await LevelService.toggleNotifications(interaction.guildId, interaction.user.id);
      
      const embed = new EmbedBuilder()
        .setColor(notifications ? 'Green' : 'Red')
        .setTitle('🔔 Level Notifications')
        .setDescription(
          notifications 
            ? '✅ Level up notifications are now **ENABLED**\nYou will receive a message when you level up.'
            : '❌ Level up notifications are now **DISABLED**\nYou will no longer receive level up messages.'
        )
        .setTimestamp();

      return interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.error('[Slash LevelNotify] Error:', err);
      return interaction.editReply('❌ Failed to toggle notifications. Please try again.');
    }
  }
};
