'use strict';

/**
 * Component: giveaway_enter
 * ─────────────────────────
 * Fires when a user clicks the green "Join Giveaway 🎉" button on any giveaway embed.
 *
 * customId format used by the ComponentsListener router:
 *   "giveaway_enter"            (matched by part1_part2 = "giveaway_enter")
 *
 * The message the button is attached to IS the giveaway message, so we use
 * interaction.message.id as the lookup key — no extra ID needs to be embedded
 * in the customId.
 *
 * @type {import('../../util/types/baseComponent')}
 */
module.exports = {
  name: 'giveaway_enter',
  enabled: true,
  public: true, // anyone can click, not just the command invoker

  async action(client, interaction) {
    // Immediately defer ephemerally so we never time out on the 3-second window.
    await interaction.deferReply({ flags: ['Ephemeral'] });

    const { getManager } = require('../../util/modules/GiveawayManager');
    const manager  = getManager(client);
    const member   = interaction.member;
    const messageId = interaction.message.id;

    try {
      const result = await manager.handleEntry(messageId, member);

      if (result.action === 'entered') {
        return interaction.editReply({
          content: '🎉 You have **successfully entered** the giveaway! Good luck!',
        });
      }

      if (result.action === 'left') {
        return interaction.editReply({
          content: '👋 You have **left** the giveaway. You can rejoin anytime before it ends.',
        });
      }

      // rejected
      return interaction.editReply({
        content: `🚫 ${result.reason}`,
      });
    } catch (err) {
      console.error('[giveaway_enter] Error handling entry:', err);
      return interaction.editReply({
        content: '❌ Something went wrong processing your entry. Please try again.',
      });
    }
  },
};
