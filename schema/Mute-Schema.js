const mongoose = require('mongoose')


const UserMuteSchema = mongoose.Schema({
    guildId: { type: String, required: true },
    userId: { type: String, required: true },

    Muted: { type: Boolean, default: false },
})


module.exports = mongoose.model('user-Mute', UserMuteSchema)