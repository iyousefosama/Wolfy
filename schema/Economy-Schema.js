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

    timer: {
        beg: {
          timeout: { type: Date, default: null }
        },
        daily: {
            timeout: { type: Date, default: null }
          }
      },

    cookies: {
        totalcookies: { type: Number, default: 0 },
        givecookies: { type: Number, default: 0 }
      },

      inv: {
        FishinPole: { type: Number, default: 0 },
        UltimateCookie: { type: Number, default: 0 }
      }
})

module.exports = mongoose.model('Economy', ecoSchema)
