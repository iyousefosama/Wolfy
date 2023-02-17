const mongoose = require('mongoose')


const UserInfractionSchema = mongoose.Schema({
    guildId: { type: String, required: true },
    userId: { type: String, required: true },

    current: { type: Number, default: 0 },
    reset: { type: Date, default: null },
})


module.exports = mongoose.model('user-infraction', UserInfractionSchema)