const mongoose = require('mongoose');

const giveawaySchema = mongoose.Schema({
    guildId: { type: String, required: true },
    current: { type: Boolean },

    giveaway: { type: [Object], required: true }
})

module.exports = mongoose.model('giveaway-schema', giveawaySchema)