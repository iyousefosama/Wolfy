const mongoose = require('mongoose');

const levelSchema = mongoose.Schema({
  guildId: { type: String, required: true },
  userId: { type: String, required: true },
  level: { type: Number, default: 1 },
  xp: { type: Number, default: 0 },
  requiredXp: { type: Number, default: 150 },
  totalXp: { type: Number, default: 0 },
  messageCount: { type: Number, default: 0 },
  notifications: { type: Boolean, default: true },
  lastMessageAt: { type: Date, default: null }
}, {
  timestamps: true
});

// Compound index for efficient queries
levelSchema.index({ guildId: 1, userId: 1 }, { unique: true });
levelSchema.index({ guildId: 1, totalXp: -1 });

module.exports = mongoose.model('GuildUserLevels', levelSchema);
