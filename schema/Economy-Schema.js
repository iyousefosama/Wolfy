const mongoose = require('mongoose')

const ecoSchema = mongoose.Schema({
    userID: {
        type: String,
        required: true
    },

    credits: {
        type: Number,
        default: 275
    },

    Bank: {
      balance: {
        credits: { type: Number, default: 0 },
        timeout: { type: Date, default: null }
      },
      info: {
        Enabled: { type: Boolean, default: false }
      }
    },
    
    profile: {
      background: {type: String, default: null},
      birthday: {type: String, default: null},
      inventory: {type: Array, default: []}
    },

    timer: {
        beg: {
          timeout: { type: Date, default: null }
        },
        daily: {
            timeout: { type: Date, default: null }
          },
        banktime: {
            timeout: { type: Date, default: null }
          }
      },
      streak: {
        alltime: {type: Number, default: 0},
        current: {type: Number, default: 0},
        timestamp: {type: Number, default: 0}
      },

    cookies: {
        totalcookies: { type: Number, default: 0 },
        givecookies: { type: Number, default: 0 }
      },

      inv: {
        Stone: { type: Number, default: 0 },
        Coal: { type: Number, default: 0 },
        Iron: { type: Number, default: 0 },
        Gold: { type: Number, default: 0 },
        Diamond: { type: Number, default: 0 }
      },
})

module.exports = mongoose.model('Economy', ecoSchema)