const mongoose = require('mongoose');

const giveawaySchema = mongoose.Schema({
    guildId: { type: String, required: true },
    giveaway: { type: [Object], required: true }
})

module.exports = mongoose.model('giveaway-schema', giveawaySchema)