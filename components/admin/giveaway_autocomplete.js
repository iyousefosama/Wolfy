'use strict';

/**
 * Component: giveaway_autocomplete
 * ──────────────────────────────────
 * Provides live autocomplete suggestions for the `message_id` option on
 * /giveaway end, reroll, pause, and resume.
 *
 * The ComponentsListener routes autocomplete interactions by commandName
 * (interaction.commandName === 'giveaway') — so this component is registered
 * under the name "giveaway" and handles autocomplete only.
 *
 * It detects the focused subcommand option and filters giveaways accordingly:
 *   end    → active giveaways only
 *   reroll → ended giveaways only
 *   pause  → active giveaways only
 *   resume → paused giveaways only
 *
 * @type {import('../../util/types/baseComponent')}
 */

const GiveawaySchema = require('../../schema/GiveAway-Schema');

module.exports = {
  name: 'giveaway',       // matches interaction.commandName for autocomplete routing
  enabled: true,

  async action(client, interaction) {
    // Only handle autocomplete — other interaction types for /giveaway
    // are handled by the slash command execute() function.
    if (!interaction.isAutocomplete()) return;

    const sub     = interaction.options.getSubcommand(false);
    const focused = interaction.options.getFocused(true);

    // Only handle the message_id field.
    if (focused.name !== 'message_id') return interaction.respond([]);

    const statusFilter = {
      end:    'active',
      pause:  'active',
      reroll: 'ended',
      resume: 'paused',
    }[sub];

    if (!statusFilter) return interaction.respond([]);

    try {
      const query = { guildId: interaction.guildId, status: statusFilter };
      const giveaways = await GiveawaySchema
        .find(query)
        .sort({ createdAt: -1 })
        .limit(25)
        .lean();

      const choices = giveaways
        .filter(g => {
          // Filter by the user's typed value (case-insensitive prize match or ID match).
          const search = focused.value.toLowerCase();
          return !search ||
            g.prize.toLowerCase().includes(search) ||
            g.messageId.includes(search);
        })
        .slice(0, 25)
        .map(g => ({
          name: `${g.prize.slice(0, 60)}  [${g.entrants.length} entries · ID: ${g.messageId}]`,
          value: g.messageId,
        }));

      return interaction.respond(choices);
    } catch (err) {
      console.error('[giveaway_autocomplete] Error fetching suggestions:', err);
      return interaction.respond([]);
    }
  },
};
