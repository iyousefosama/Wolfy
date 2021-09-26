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

    cookies: {
        totalcookies: { type: Number, default: 0 },
        givecookies: { type: Number, default: 0 }
      },

      inv: {
        FishinPole: { type: Number, default: 0 },
        UltimateCookie: { type: Number, default: 0 },

        StonePickaxe: { type: Number, default: 0 },
        IronPickaxe: { type: Number, default: 0 },
        DiamondPickaxe: { type: Number, default: 0 },
        Stone: { type: Number, default: 0 },
        Coal: { type: Number, default: 0 },
        Iron: { type: Number, default: 0 },
        Gold: { type: Number, default: 0 },
        Diamond: { type: Number, default: 0 },
      }
})

module.exports = mongoose.model('Economy', ecoSchema)