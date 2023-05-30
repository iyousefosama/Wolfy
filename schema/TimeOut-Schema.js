const mongoose = require('mongoose')


const TimeOutSchema = mongoose.Schema({
    guildId: { type: String, required: false },
    userId: { type: String, required: true },

    suggestion: { type: Date, required: false },
    reports: { type: Date, required: false },
    feedback: { type: Date, required: false },

    Reminder: {
        current: {
            type: Boolean,
            default: false
        },

        time: {
            type: Date,
            default: 0
        }, 

        timezone: {
            type: String,
            default: 'UTC'
        },

        reason: {
            type: String,
            default: null
        }
    }
})


module.exports = mongoose.model('user-timeout', TimeOutSchema)