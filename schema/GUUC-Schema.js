const mongoose = require('mongoose')

const guucSchema = mongoose.Schema({
    userID: {
        type: String,
        required: true
    },
    
    UsedCommandsInv: {
      type: Array,
      default: [Object]
    },

    timeoutReset: { type: Date, default: null },

    UsedCommandsWarn: { type: Number, default: 0 },

    UsedCommandsWarnsReset: { type: Date, default: 0 },

    GlobalWarns: { type: Number, default: 0 },

    GlobalWarnsReset: { type: Date, default: null },

    Status: {
      SilentBlacklist: {
        reason: { type: String, default: null },
        current: { type: Boolean, default: false }
      }
      },
})

module.exports = mongoose.model('GUUC', guucSchema)