'use strict';

const mongoose = require('mongoose');

/**
 * @typedef {Object} GiveawayDocument
 * @property {string}   guildId          - The guild this giveaway belongs to
 * @property {string}   channelId        - The channel where the giveaway embed was sent
 * @property {string}   messageId        - The message ID of the giveaway embed (used as the primary key for lookups)
 * @property {string}   hostId           - User ID of the admin who created the giveaway
 * @property {string}   prize            - The prize title
 * @property {string}   description      - Optional longer description of the prize
 * @property {number}   winnerCount      - How many winners to draw
 * @property {string[]} entrants         - Array of user IDs who have entered
 * @property {string[]} winners          - Array of user IDs drawn as winners (populated after end)
 * @property {string[]} requiredRoles    - Role IDs required to enter (empty = no restriction)
 * @property {string[]} bypassRoles      - Role IDs that bypass requirements (bonus entries etc.)
 * @property {Date}     endsAt           - UTC timestamp when the giveaway expires
 * @property {string}   status           - 'active' | 'paused' | 'ended'
 * @property {number}   remainingMs      - Milliseconds remaining at time of pause (used to resume correctly)
 */
const giveawaySchema = new mongoose.Schema(
  {
    guildId:       { type: String, required: true, index: true },
    channelId:     { type: String, required: true },
    messageId:     { type: String, required: true, unique: true, index: true },
    hostId:        { type: String, required: true },
    prize:         { type: String, required: true },
    description:   { type: String, default: '' },
    winnerCount:   { type: Number, required: true, min: 1, max: 10, default: 1 },
    entrants:      { type: [String], default: [] },
    winners:       { type: [String], default: [] },
    requiredRoles: { type: [String], default: [] },
    bypassRoles:   { type: [String], default: [] },
    endsAt:        { type: Date, required: true },
    status:        { type: String, enum: ['active', 'paused', 'ended'], default: 'active' },
    remainingMs:   { type: Number, default: 0 },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model('Giveaway', giveawaySchema);