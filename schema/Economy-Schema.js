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
      ProfileBackground: {type: String, default: null},
      badge: {type: String, default: null},
      pattern: {type: String, default: null},
      bio: {type: String, default: 'No bio written!'},
      hat: {type: String, default: null},
      birthday: {type: String, default: null},
      inventory: {type: Array, default: []}
    },

    tips: {
      given: {type: Number, default: 0},
      received: {type: Number, default: 0},
      timestamp: {type: Number, default: 0}
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

      progress: {
        quests: { type: Array, default: []},
        completed: { type: Number, default: 0},
        claimed: { type: Boolean, default: false },
        TimeReset: { type: Date, default: 0 }
      },

      mails: {
        isEnabled: { type: Boolean, default: false},
        mails: { type: Array, default: []}
      },

      inv: {
        Stone: { type: Number, default: 0 },
        Coal: { type: Number, default: 0 },
        Iron: { type: Number, default: 0 },
        Gold: { type: Number, default: 0 },
        Diamond: { type: Number, default: 0 }
      },

      vote: {
        notification: { type: Boolean, default: true }
      }
})

module.exports = mongoose.model('Economy', ecoSchema)