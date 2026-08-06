const mongoose = require('mongoose');

const warnEntrySchema = mongoose.Schema({
    warnId: { type: String, required: true },
    authorId: { type: String, required: true },
    reason: { type: String, required: true },
    timestamp: { type: Number, required: true },
}, { _id: false });

const warnSchema = mongoose.Schema({
    guildId: { type: String, required: true },
    userId: { type: String, required: true },
    warnings: { type: [warnEntrySchema], default: [] }
})

module.exports = mongoose.model('warned-user', warnSchema)