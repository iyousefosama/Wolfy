'use strict';

/**
 * GiveawayManager
 * ───────────────
 * Centralised service that owns all giveaway business logic.
 * The slash-command files and button component delegate to this class
 * so that every code-path (create / end / reroll / pause / resume /
 * bot-restart recovery) goes through one auditable place.
 *
 * Timer strategy
 * ──────────────
 * We use a plain Map<messageId, Timeout> instead of a cron library so
 * there are zero extra dependencies.  On bot restart `resumeAll()` is
 * called once from the `clientReady` event; it reads every 'active'
 * giveaway from the DB and re-schedules their timers based on the
 * remaining real-world time (endsAt - Date.now()).  Paused giveaways
 * are skipped — they resume only when an admin calls /giveaway resume.
 *
 * Button-press debouncing
 * ───────────────────────
 * Entry counts are written to the DB on every button press (low volume
 * is fine for most servers).  For high-traffic use-cases swap the
 * direct DB write for a Redis incr and flush periodically.
 */

const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Colors,
} = require('discord.js');

const GiveawaySchema = require('../../schema/GiveAway-Schema');

// ─── Embed helpers ────────────────────────────────────────────────────────────

/**
 * Build the main giveaway embed for an ACTIVE giveaway.
 * @param {import('../../schema/GiveAway-Schema').GiveawayDocument} data
 * @param {import('discord.js').GuildMember} host
 */
function buildActiveEmbed(data, host) {
  const endsAtUnix = Math.floor(new Date(data.endsAt).getTime() / 1000);

  const embed = new EmbedBuilder()
    .setTitle(`🎉  ${data.prize}`)
    .setColor(0x5865f2) // Discord blurple
    .setThumbnail(host?.user?.displayAvatarURL({ size: 256 }) ?? null)
    .setFooter({ text: `Hosted by ${host?.user?.tag ?? 'Unknown'}  •  Message ID: ${data.messageId}` })
    .setTimestamp(data.endsAt);

  const lines = [];
  if (data.description) lines.push(`> ${data.description}`, '');
  lines.push(
    `🏆  **Winners:** ${data.winnerCount}`,
    `👥  **Entries:** ${data.entrants.length}`,
    `⏰  **Ends:** <t:${endsAtUnix}:R> (<t:${endsAtUnix}:f>)`,
  );
  if (data.requiredRoles.length)
    lines.push(`🔒  **Required role(s):** ${data.requiredRoles.map(id => `<@&${id}>`).join(', ')}`);
  if (data.status === 'paused')
    lines.push('\n⏸️  **This giveaway is currently PAUSED.**');

  embed.setDescription(lines.join('\n'));
  return embed;
}

/**
 * Build the ended embed (greyed out, lists winners).
 * @param {import('../../schema/GiveAway-Schema').GiveawayDocument} data
 */
function buildEndedEmbed(data) {
  const endsAtUnix = Math.floor(new Date(data.endsAt).getTime() / 1000);
  const winnerMentions = data.winners.length
    ? data.winners.map(id => `<@${id}>`).join(', ')
    : '*(No valid entrants — nobody won)*';

  const embed = new EmbedBuilder()
    .setTitle(`[ENDED]  ${data.prize}`)
    .setColor(Colors.DarkGrey)
    .setDescription(
      [
        data.description ? `> ${data.description}\n` : '',
        `🏆  **Winner(s):** ${winnerMentions}`,
        `👥  **Total entries:** ${data.entrants.length}`,
        `⏰  **Ended:** <t:${endsAtUnix}:R>`,
      ].join('\n')
    )
    .setTimestamp();

  return embed;
}

/** The single button row attached to an active giveaway embed. */
function buildEntryRow(entryCount, disabled = false) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('giveaway_enter')
      .setLabel(`Join Giveaway 🎉  (${entryCount})`)
      .setStyle(ButtonStyle.Success)
      .setDisabled(disabled),
  );
}

// ─── Main class ───────────────────────────────────────────────────────────────

class GiveawayManager {
  /**
   * @param {import('../../struct/Client')} client
   */
  constructor(client) {
    this.client = client;
    /** @type {Map<string, NodeJS.Timeout>} messageId → active setTimeout handle */
    this._timers = new Map();
  }

  // ── Database layer ──────────────────────────────────────────────────────────

  /** Fetch a single giveaway by its Discord message ID. */
  async fetch(messageId) {
    return GiveawaySchema.findOne({ messageId }).lean();
  }

  /** Fetch all active giveaways for a guild. */
  async fetchActive(guildId) {
    return GiveawaySchema.find({ guildId, status: 'active' }).lean();
  }

  /** Fetch all giveaways (any status) for autocomplete. */
  async fetchAll(guildId) {
    return GiveawaySchema.find({ guildId }).sort({ createdAt: -1 }).limit(25).lean();
  }

  // ── Timer management ────────────────────────────────────────────────────────

  /**
   * Schedule the end-timer for a giveaway.
   * @param {string} messageId
   * @param {number} delayMs   How many ms from NOW until the giveaway ends.
   */
  _scheduleEnd(messageId, delayMs) {
    // Clear any existing timer first (safety guard).
    if (this._timers.has(messageId)) clearTimeout(this._timers.get(messageId));

    // Cap at ~24.8 days (max safe setTimeout) and re-schedule if needed.
    const MAX_DELAY = 2_147_483_647;
    const safeDelay = Math.min(delayMs, MAX_DELAY);

    const handle = setTimeout(async () => {
      this._timers.delete(messageId);

      if (delayMs > MAX_DELAY) {
        // We hit the cap — re-schedule the remainder.
        this._scheduleEnd(messageId, delayMs - MAX_DELAY);
      } else {
        await this.end(messageId, { auto: true });
      }
    }, safeDelay);

    // Unref so the timer doesn't keep Node alive if the process wants to exit.
    handle.unref?.();
    this._timers.set(messageId, handle);
  }

  /**
   * Called once on `clientReady` — restores timers for every active giveaway
   * that survived a bot restart.
   */
  async resumeAll() {
    const all = await GiveawaySchema.find({ status: 'active' }).lean();
    let restored = 0;

    for (const giveaway of all) {
      const remaining = new Date(giveaway.endsAt).getTime() - Date.now();
      if (remaining <= 0) {
        // Already expired while the bot was offline — end it immediately.
        await this.end(giveaway.messageId, { auto: true });
      } else {
        this._scheduleEnd(giveaway.messageId, remaining);
        restored++;
      }
    }

    if (all.length > 0) {
      console.log(`[GiveawayManager] Restored ${restored} active giveaway timer(s).`);
    }
  }

  // ── Core operations ─────────────────────────────────────────────────────────

  /**
   * Create a brand-new giveaway, post the embed, start the timer.
   * @param {object} opts
   * @param {import('discord.js').TextChannel} opts.channel
   * @param {import('discord.js').GuildMember}  opts.host
   * @param {string}   opts.prize
   * @param {string}   opts.description
   * @param {number}   opts.durationMs
   * @param {number}   opts.winnerCount
   * @param {string[]} opts.requiredRoles
   * @param {string[]} opts.bypassRoles
   * @returns {Promise<GiveawayDocument>}
   */
  async create({ channel, host, prize, description, durationMs, winnerCount, requiredRoles, bypassRoles }) {
    const endsAt = new Date(Date.now() + durationMs);

    // Send a placeholder embed first — we need the message ID before saving.
    const placeholderData = {
      prize, description, winnerCount,
      entrants: [], requiredRoles, bypassRoles,
      endsAt, messageId: 'pending', status: 'active',
      hostId: host.id, guildId: channel.guild.id, channelId: channel.id,
    };

    const embed = buildActiveEmbed(placeholderData, host);
    const row   = buildEntryRow(0);

    const message = await channel.send({ embeds: [embed], components: [row] });

    // Now save with the real messageId.
    const giveaway = await GiveawaySchema.create({
      guildId:       channel.guild.id,
      channelId:     channel.id,
      messageId:     message.id,
      hostId:        host.id,
      prize, description, winnerCount,
      requiredRoles: requiredRoles ?? [],
      bypassRoles:   bypassRoles   ?? [],
      endsAt,
      status: 'active',
    });

    // Update the footer with the real message ID.
    await message.edit({ embeds: [buildActiveEmbed(giveaway, host)] });

    this._scheduleEnd(message.id, durationMs);
    return giveaway;
  }

  /**
   * End a giveaway — draw winners, edit the embed, announce.
   * @param {string}  messageId
   * @param {object}  [opts]
   * @param {boolean} [opts.auto=false]  true when called by the scheduler
   */
  async end(messageId, { auto = false } = {}) {
    // Fetch fresh (not lean so we can save).
    const giveaway = await GiveawaySchema.findOne({ messageId });
    if (!giveaway) throw new Error(`Giveaway \`${messageId}\` not found.`);
    if (giveaway.status === 'ended') throw new Error('This giveaway has already ended.');

    // Clear timer if end was triggered manually.
    if (!auto && this._timers.has(messageId)) {
      clearTimeout(this._timers.get(messageId));
      this._timers.delete(messageId);
    }

    const winners = this._drawWinners(giveaway.entrants, giveaway.winnerCount, giveaway.guildId);

    giveaway.winners = winners;
    giveaway.status  = 'ended';
    await giveaway.save();

    await this._updateEndedMessage(giveaway);
    return giveaway;
  }

  /**
   * Reroll — pick new winners from the existing entrant pool of an ENDED giveaway.
   * @param {string} messageId
   */
  async reroll(messageId) {
    const giveaway = await GiveawaySchema.findOne({ messageId });
    if (!giveaway)              throw new Error(`Giveaway \`${messageId}\` not found.`);
    if (giveaway.status !== 'ended') throw new Error('You can only reroll an **ended** giveaway.');
    if (!giveaway.entrants.length)   throw new Error('There are no entrants in this giveaway to reroll from.');

    const winners = this._drawWinners(giveaway.entrants, giveaway.winnerCount, giveaway.guildId);
    giveaway.winners = winners;
    await giveaway.save();

    await this._updateEndedMessage(giveaway);
    return giveaway;
  }

  /**
   * Pause a giveaway — disables the entry button and stores remaining time.
   * @param {string} messageId
   */
  async pause(messageId) {
    const giveaway = await GiveawaySchema.findOne({ messageId });
    if (!giveaway)                   throw new Error(`Giveaway \`${messageId}\` not found.`);
    if (giveaway.status === 'ended') throw new Error('Cannot pause an ended giveaway.');
    if (giveaway.status === 'paused') throw new Error('This giveaway is already paused.');

    // Calculate and store remaining time before clearing the timer.
    const remainingMs = Math.max(0, new Date(giveaway.endsAt).getTime() - Date.now());
    giveaway.remainingMs = remainingMs;
    giveaway.status      = 'paused';
    await giveaway.save();

    if (this._timers.has(messageId)) {
      clearTimeout(this._timers.get(messageId));
      this._timers.delete(messageId);
    }

    await this._refreshActiveMessage(giveaway);
    return giveaway;
  }

  /**
   * Resume a paused giveaway — re-enables the button and restarts the timer
   * using the stored remaining time.
   * @param {string} messageId
   */
  async resume(messageId) {
    const giveaway = await GiveawaySchema.findOne({ messageId });
    if (!giveaway)                    throw new Error(`Giveaway \`${messageId}\` not found.`);
    if (giveaway.status === 'ended')  throw new Error('Cannot resume an ended giveaway.');
    if (giveaway.status === 'active') throw new Error('This giveaway is not paused.');

    // Recalculate endsAt from remaining time so the Discord timestamp is accurate.
    const newEndsAt = new Date(Date.now() + giveaway.remainingMs);
    giveaway.endsAt      = newEndsAt;
    giveaway.status      = 'active';
    giveaway.remainingMs = 0;
    await giveaway.save();

    this._scheduleEnd(messageId, giveaway.remainingMs || (newEndsAt - Date.now()));
    await this._refreshActiveMessage(giveaway);
    return giveaway;
  }

  // ── Entry handling ──────────────────────────────────────────────────────────

  /**
   * Handle a user pressing the "Join Giveaway" button.
   * Returns { action: 'entered'|'left'|'rejected', reason?: string }
   *
   * @param {string}                           messageId
   * @param {import('discord.js').GuildMember} member
   */
  async handleEntry(messageId, member) {
    const giveaway = await GiveawaySchema.findOne({ messageId });

    if (!giveaway || giveaway.status !== 'active') {
      return { action: 'rejected', reason: 'This giveaway is no longer active.' };
    }

    // ── Role requirement check ──
    if (giveaway.requiredRoles.length) {
      const hasRequired = giveaway.requiredRoles.some(roleId => member.roles.cache.has(roleId));
      // Bypass roles skip the requirement check.
      const hasBypass   = giveaway.bypassRoles.some(roleId => member.roles.cache.has(roleId));

      if (!hasRequired && !hasBypass) {
        const roleList = giveaway.requiredRoles.map(id => `<@&${id}>`).join(', ');
        return {
          action: 'rejected',
          reason: `You need one of the following role(s) to enter: ${roleList}`,
        };
      }
    }

    const alreadyIn = giveaway.entrants.includes(member.id);

    if (alreadyIn) {
      // Toggle — leave the giveaway.
      await GiveawaySchema.updateOne({ messageId }, { $pull: { entrants: member.id } });
      await this._refreshEntryCount(messageId);
      return { action: 'left' };
    } else {
      // Enter the giveaway.
      await GiveawaySchema.updateOne({ messageId }, { $addToSet: { entrants: member.id } });
      await this._refreshEntryCount(messageId);
      return { action: 'entered' };
    }
  }

  // ── Private helpers ─────────────────────────────────────────────────────────

  /**
   * Randomly draw up to `count` unique winners from the entrant pool.
   * Members who have left the guild are silently filtered out.
   * @param {string[]} entrants
   * @param {number}   count
   * @param {string}   guildId
   */
  _drawWinners(entrants, count, guildId) {
    // Fisher-Yates shuffle on a copy.
    const pool = [...entrants];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    const guild = this.client.guilds.cache.get(guildId);
    const winners = [];

    for (const userId of pool) {
      if (winners.length >= count) break;
      // Only pick users still in the guild.
      if (!guild || guild.members.cache.has(userId)) {
        winners.push(userId);
      }
    }

    return winners;
  }

  /**
   * Fetch the giveaway message from Discord and update the button entry count.
   * Silently swallows errors (message may have been deleted).
   */
  async _refreshEntryCount(messageId) {
    try {
      const data    = await GiveawaySchema.findOne({ messageId }).lean();
      const channel = await this.client.channels.fetch(data.channelId).catch(() => null);
      if (!channel) return;
      const message = await channel.messages.fetch(messageId).catch(() => null);
      if (!message) return;

      const host  = await channel.guild.members.fetch(data.hostId).catch(() => null);
      const embed = buildActiveEmbed(data, host);
      const row   = buildEntryRow(data.entrants.length, data.status !== 'active');

      await message.edit({ embeds: [embed], components: [row] });
    } catch { /* no-op */ }
  }

  /**
   * Edit the giveaway message to reflect active/paused state changes.
   */
  async _refreshActiveMessage(giveaway) {
    try {
      const channel = await this.client.channels.fetch(giveaway.channelId).catch(() => null);
      if (!channel) return;
      const message = await channel.messages.fetch(giveaway.messageId).catch(() => null);
      if (!message) return;

      const host  = await channel.guild.members.fetch(giveaway.hostId).catch(() => null);
      const embed = buildActiveEmbed(giveaway, host);
      const row   = buildEntryRow(giveaway.entrants.length, giveaway.status === 'paused');

      await message.edit({ embeds: [embed], components: [row] });
    } catch { /* no-op */ }
  }

  /**
   * Edit the giveaway message to the ENDED state and send a winner announcement.
   */
  async _updateEndedMessage(giveaway) {
    try {
      const channel = await this.client.channels.fetch(giveaway.channelId).catch(() => null);
      if (!channel) return;
      const message = await channel.messages.fetch(giveaway.messageId).catch(() => null);

      const endedEmbed = buildEndedEmbed(giveaway);

      // Disable the button on the embed.
      const disabledRow = buildEntryRow(giveaway.entrants.length, true);
      if (message) await message.edit({ embeds: [endedEmbed], components: [disabledRow] });

      // Send the winner announcement in the channel.
      if (giveaway.winners.length) {
        const winnerPing = giveaway.winners.map(id => `<@${id}>`).join(', ');
        await channel.send({
          content: `🎊 **Giveaway ended!**\n${winnerPing} won **${giveaway.prize}**! Congratulations! 🎉`,
          embeds: [
            new EmbedBuilder()
              .setColor(0xfee75c) // Discord yellow
              .setDescription(
                `🏆 **Winner(s):** ${winnerPing}\n` +
                `🎁 **Prize:** ${giveaway.prize}\n` +
                `[Jump to giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})`
              )
              .setTimestamp(),
          ],
        });
      } else {
        await channel.send({
          content: `😔 The giveaway for **${giveaway.prize}** ended with no valid entrants.`,
        });
      }
    } catch (err) {
      console.error('[GiveawayManager] Failed to update ended message:', err);
    }
  }
}

// Singleton — one manager instance shared across the whole bot process.
let _instance = null;

/**
 * Get (or lazily create) the singleton GiveawayManager.
 * @param {import('../../struct/Client')} [client]
 * @returns {GiveawayManager}
 */
function getManager(client) {
  if (!_instance) {
    if (!client) throw new Error('GiveawayManager not yet initialised — pass the client on first call.');
    _instance = new GiveawayManager(client);
  }
  return _instance;
}

module.exports = { getManager, buildActiveEmbed, buildEndedEmbed, buildEntryRow };
