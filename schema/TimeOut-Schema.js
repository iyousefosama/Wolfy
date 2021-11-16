const mongoose = require('mongoose')


const TimeOutSchema = mongoose.Schema({
    guildId: { type: String, required: true },
    userId: { type: String, required: true },

    suggestion: { type: Date, required: false },
    reports: { type: Date, required: false },
    feedback: { type: Date, required: false }
})


module.exports = mongoose.model('user-timeout', TimeOutSchema)