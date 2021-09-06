const mongoose = require('mongoose')

const ecoSchema = mongoose.Schema({
    userID: {
        type: String,
        required: true
    },

    credits: {
        type: Number,
        default: 275
    }
})

module.exports = mongoose.model('Economy', ecoSchema)