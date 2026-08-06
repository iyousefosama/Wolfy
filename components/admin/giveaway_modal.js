'use strict';

/**
 * Component: giveaway_modal
 * ─────────────────────────
 * Handles the modal submission from /giveaway create.
 *
 * The slash command stores the create options in-memory (GiveawayModalState)
 * under a short random key and embeds only that key in the customId:
 *   giveaway_modal_<stateKey>
 *
 * The ComponentsListener routes modal submits by exact customId match, then
 * falls back to prefix matching, so registering under the base name
 * "giveaway_modal" still catches our dynamic customId.
 *
 * @type {import('../../util/types/baseComponent')}
 */
module.exports = {
  name: 'giveaway_modal',
  enabled: true,

  async action(client, interaction) {
    await interaction.deferReply({ flags: ['Ephemeral'] });

    try {
      // ── Load options from the state map ───────────────────────────────────
      const stateKey = interaction.customId.split('_')[2];
      const { takeModalState } = require('../../util/modules/GiveawayModalState');
      const state = takeModalState(stateKey);

      if (!state) {
        return interaction.editReply({
          content: '❌ This giveaway session has expired. Please run `/giveaway create` again.',
        });
      }

      const {
        durationMs,
        winnerCount,
        channelId,
        requiredRoleId,
        bypassRoleId,
      } = state;

      const prize       = interaction.fields.getTextInputValue('prize').trim();
      const description = interaction.fields.getTextInputValue('description')?.trim() ?? '';

      if (!prize) {
        return interaction.editReply({ content: '❌ Prize cannot be empty.' });
      }

      const channel = await client.channels.fetch(channelId).catch(() => null);
      if (!channel?.isTextBased()) {
        return interaction.editReply({ content: '❌ The target channel is invalid or inaccessible.' });
      }

      const host = interaction.member;

      const { getManager } = require('../../util/modules/GiveawayManager');
      const manager = getManager(client);

      await manager.create({
        channel,
        host,
        prize,
        description,
        durationMs,
        winnerCount,
        requiredRoles: requiredRoleId ? [requiredRoleId] : [],
        bypassRoles:   bypassRoleId   ? [bypassRoleId]   : [],
      });

      return interaction.editReply({
        content: `✅ Giveaway for **${prize}** has been started in <#${channelId}>!`,
      });
    } catch (err) {
      console.error('[giveaway_modal] Error creating giveaway:', err);
      return interaction.editReply({ content: `❌ Failed to create giveaway: ${err.message}` });
    }
  },
};
