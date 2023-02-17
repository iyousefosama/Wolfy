const mongoose = require('mongoose');

const levelSchema = mongoose.Schema({
    guildId: { type: String, required: true },
    userId: { type: String, required: true },

    System: {
        level: { type: Number, default: 0 },
        xp: { type: Number, default: 0 },
        required: { type: Number, default: 225 }
    }
})

module.exports = mongoose.model('(G)users-Levels', levelSchema)