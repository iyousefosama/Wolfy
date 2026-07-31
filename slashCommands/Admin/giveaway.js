'use strict';

/**
 * /giveaway — parent command with all subcommands.
 *
 * Subcommands:
 *  create  — opens a Modal to collect Prize + Description, then starts the giveaway
 *  end     — immediately draws winners for an active giveaway
 *  reroll  — re-draws winners for an ended giveaway
 *  pause   — freezes the countdown and disables the entry button
 *  resume  — unfreezes a paused giveaway
 *
 * Autocomplete is wired to the `message_id` string option so admins can
 * pick a giveaway from a live dropdown instead of copy-pasting IDs.
 *
 * @type {import('../../util/types/baseCommandSlash')}
 */

const { ApplicationCommandOptionType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const ms = require('ms');

module.exports = {
  data: {
    name: 'giveaway',
    description: 'Full-featured giveaway system 🎉',
    guildOnly: true,
    dmOnly: false,
    cooldown: 3,
    group: 'Moderation',
    requiresDatabase: true,
    clientPermissions: ['SendMessages', 'EmbedLinks'],
    permissions: ['ManageGuild'],
    options: [
      // ── /giveaway create ──────────────────────────────────────────────────
      {
        type: ApplicationCommandOptionType.Subcommand,
        name: 'create',
        description: 'Start a new giveaway in this channel.',
        options: [
          {
            type: ApplicationCommandOptionType.String,
            name: 'duration',
            description: 'How long the giveaway runs (e.g. 10m, 2h, 1d)',
            required: true,
          },
          {
            type: ApplicationCommandOptionType.Integer,
            name: 'winners',
            description: 'Number of winners to draw (1–10)',
            required: true,
            min_value: 1,
            max_value: 10,
          },
          {
            type: ApplicationCommandOptionType.Channel,
            name: 'channel',
            description: 'Channel to host the giveaway in (defaults to current channel)',
            required: false,
          },
          {
            type: ApplicationCommandOptionType.Role,
            name: 'required_role',
            description: 'Role members must have to enter (optional)',
            required: false,
          },
          {
            type: ApplicationCommandOptionType.Role,
            name: 'bypass_role',
            description: 'Role that bypasses the required-role restriction (optional)',
            required: false,
          },
        ],
      },

      // ── /giveaway end ─────────────────────────────────────────────────────
      {
        type: ApplicationCommandOptionType.Subcommand,
        name: 'end',
        description: 'Immediately end an active giveaway and draw winners.',
        options: [
          {
            type: ApplicationCommandOptionType.String,
            name: 'message_id',
            description: 'Message ID of the giveaway (supports autocomplete)',
            required: true,
            autocomplete: true,
          },
        ],
      },

      // ── /giveaway reroll ─────────────────────────────────────────────────
      {
        type: ApplicationCommandOptionType.Subcommand,
        name: 'reroll',
        description: "Re-draw winners from an ended giveaway's entrant pool.",
        options: [
          {
            type: ApplicationCommandOptionType.String,
            name: 'message_id',
            description: 'Message ID of the ended giveaway (supports autocomplete)',
            required: true,
            autocomplete: true,
          },
        ],
      },

      // ── /giveaway pause ──────────────────────────────────────────────────
      {
        type: ApplicationCommandOptionType.Subcommand,
        name: 'pause',
        description: 'Pause the countdown timer and disable the entry button.',
        options: [
          {
            type: ApplicationCommandOptionType.String,
            name: 'message_id',
            description: 'Message ID of the active giveaway (supports autocomplete)',
            required: true,
            autocomplete: true,
          },
        ],
      },

      // ── /giveaway resume ─────────────────────────────────────────────────
      {
        type: ApplicationCommandOptionType.Subcommand,
        name: 'resume',
        description: 'Resume a paused giveaway.',
        options: [
          {
            type: ApplicationCommandOptionType.String,
            name: 'message_id',
            description: 'Message ID of the paused giveaway (supports autocomplete)',
            required: true,
            autocomplete: true,
          },
        ],
      },
    ],
  },

  // ─── execute ────────────────────────────────────────────────────────────────
  async execute(client, interaction) {
    const { getManager } = require('../../util/modules/GiveawayManager');
    const manager = getManager(client);
    const sub     = interaction.options.getSubcommand();

    // ── CREATE ───────────────────────────────────────────────────────────────
    if (sub === 'create') {
      const durationStr  = interaction.options.getString('duration', true);
      const winnerCount  = interaction.options.getInteger('winners', true);
      const targetChannel = interaction.options.getChannel('channel') ?? interaction.channel;
      const requiredRole  = interaction.options.getRole('required_role');
      const bypassRole    = interaction.options.getRole('bypass_role');

      const durationMs = ms(durationStr);
      if (!durationMs || durationMs < 10_000) {
        return interaction.reply({
          content: '❌ Invalid duration. Use a format like `10m`, `2h`, or `1d`. Minimum is 10 seconds.',
          flags: ['Ephemeral'],
        });
      }
      if (durationMs > ms('30d')) {
        return interaction.reply({
          content: '❌ Duration cannot exceed 30 days.',
          flags: ['Ephemeral'],
        });
      }

      // Store options in the customId so we can read them from the modal submit handler.
      // Format: giveaway_modal_<durationMs>_<winners>_<channelId>_<reqRole|0>_<bypassRole|0>
      const customId = [
        'giveaway_modal',
        durationMs,
        winnerCount,
        targetChannel.id,
        requiredRole?.id  ?? '0',
        bypassRole?.id    ?? '0',
      ].join('_');

      const modal = new ModalBuilder()
        .setCustomId(customId)
        .setTitle('🎉 Create a Giveaway');

      const prizeInput = new TextInputBuilder()
        .setCustomId('prize')
        .setLabel('Prize')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('e.g. Discord Nitro 1 Month')
        .setMaxLength(100)
        .setRequired(true);

      const descInput = new TextInputBuilder()
        .setCustomId('description')
        .setLabel('Description  (optional)')
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder('Add extra details about the prize or how to claim it...')
        .setMaxLength(500)
        .setRequired(false);

      modal.addComponents(
        new ActionRowBuilder().addComponents(prizeInput),
        new ActionRowBuilder().addComponents(descInput),
      );

      return interaction.showModal(modal);
    }

    // ── Shared helper: defer so heavy DB ops don't time out ─────────────────
    await interaction.deferReply({ flags: ['Ephemeral'] });
    const messageId = interaction.options.getString('message_id', true);

    try {
      if (sub === 'end') {
        const giveaway = await manager.end(messageId);
        const winnerList = giveaway.winners.length
          ? giveaway.winners.map(id => `<@${id}>`).join(', ')
          : '*(no valid entrants)*';
        return interaction.editReply(`✅ Giveaway ended! Winner(s): ${winnerList}`);
      }

      if (sub === 'reroll') {
        const giveaway = await manager.reroll(messageId);
        const winnerList = giveaway.winners.map(id => `<@${id}>`).join(', ');
        return interaction.editReply(`🎲 Rerolled! New winner(s): ${winnerList}`);
      }

      if (sub === 'pause') {
        await manager.pause(messageId);
        return interaction.editReply('⏸️ Giveaway paused successfully.');
      }

      if (sub === 'resume') {
        await manager.resume(messageId);
        return interaction.editReply('▶️ Giveaway resumed successfully.');
      }
    } catch (err) {
      return interaction.editReply(`❌ ${err.message}`);
    }
  },
};
