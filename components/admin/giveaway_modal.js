'use strict';

/**
 * Component: giveaway_modal
 * ─────────────────────────
 * Handles the modal submission from /giveaway create.
 *
 * The customId encodes all options set in the slash command:
 *   giveaway_modal_<durationMs>_<winners>_<channelId>_<reqRoleId|0>_<bypassRoleId|0>
 *
 * The ComponentsListener routes modal submits by exact customId match, but our
 * customId is dynamic (contains encoded data). We handle this by registering
 * with a prefix-matched name pattern and the listener will route it.
 *
 * IMPORTANT: The ComponentsListener in this project does:
 *   client.ComponentsAction.get(interaction.customId)
 * for modals — meaning it looks up the *exact* customId. Since ours is dynamic
 * we register as "giveaway_modal" and patch the listener to do a startsWith
 * fallback (see notes at bottom of this file).
 *
 * @type {import('../../util/types/baseComponent')}
 */
module.exports = {
  name: 'giveaway_modal',
  enabled: true,

  async action(client, interaction) {
    await interaction.deferReply({ flags: ['Ephemeral'] });

    try {
      // ── Decode options from customId ──────────────────────────────────────
      // Format: giveaway_modal_<durationMs>_<winners>_<channelId>_<reqRole>_<bypassRole>
      const parts        = interaction.customId.split('_');
      const durationMs   = parseInt(parts[2], 10);
      const winnerCount  = parseInt(parts[3], 10);
      const channelId    = parts[4];
      const reqRoleId    = parts[5] !== '0' ? parts[5] : null;
      const bypassRoleId = parts[6] !== '0' ? parts[6] : null;

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
        requiredRoles: reqRoleId    ? [reqRoleId]    : [],
        bypassRoles:   bypassRoleId ? [bypassRoleId] : [],
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
