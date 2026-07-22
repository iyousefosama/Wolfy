const mongoose = require('mongoose')

const guildSchema = new mongoose.Schema({
  GuildID: {
    type: String,
    required: true
  },

  prefix: { type: String, default: null },
  blacklisted: { type: Boolean, default: false },
  language: { type: String, default: 'en' },

  Mod: {
    commands: { type: Array, default: [] },
    Suggestion: {
      isEnabled: { type: Boolean, default: false },
      channel: { type: String, default: null },
      time: { type: Number, default: 7.2e+6 },
      type: { type: String, default: 'default' }
    },
    Reports: {
      isEnabled: { type: Boolean, default: false },
      channel: { type: String, default: null },
      timeout: { type: Number, default: 6 },
      type: { type: String, default: 'default' }
    },
    smroles: {
      id: { type: String, default: null },
      isEnabled: { type: Boolean, default: false },
      value1: { type: String, default: null },
      value2: { type: String, default: null },
      value3: { type: String, default: null },
      value4: { type: String, default: null },
      value5: { type: String, default: null },
      value6: { type: String, default: null },
    },
    Tickets: {
      isEnabled: { type: Boolean, default: false },
      channel: { type: String, default: null },
      type: { type: String, default: 'global' }
    },
    Logs: {
      isEnabled: { type: Boolean, default: false },
      channel: { type: String, default: null },
      type: { type: String, default: 'default' },
      separated: {
        messageDelete: {
          isEnabled: { type: Boolean, default: false },
          channel: { type: String, default: null }
        },
        messageUpdate: {
          isEnabled: { type: Boolean, default: false },
          channel: { type: String, default: null },
          type: { type: String, default: 'default' }
        },
        memberJoin: {
          isEnabled: { type: Boolean, default: false },
          channel: { type: String, default: null },
          type: { type: String, default: 'default' }
        },
        memberLeave: {
          isEnabled: { type: Boolean, default: false },
          channel: { type: String, default: null },
          type: { type: String, default: 'default' }
        },
        channelCreate: {
          isEnabled: { type: Boolean, default: false },
          channel: { type: String, default: null },
          type: { type: String, default: 'default' }
        },
        channelDelete: {
          isEnabled: { type: Boolean, default: false },
          channel: { type: String, default: null },
          type: { type: String, default: 'default' }
        },
        channelUpdate: {
          isEnabled: { type: Boolean, default: false },
          channel: { type: String, default: null },
          type: { type: String, default: 'default' }
        },
        RoleCreate: {
          isEnabled: { type: Boolean, default: false },
          channel: { type: String, default: null },
          type: { type: String, default: 'default' }
        },
        RoleDelete: {
          isEnabled: { type: Boolean, default: false },
          channel: { type: String, default: null },
          type: { type: String, default: 'default' }
        },
        RoleUpdate: {
          isEnabled: { type: Boolean, default: false },
          channel: { type: String, default: null },
          type: { type: String, default: 'default' }
        },
      },
    },
    Level: {
      Roles: { type: Array, default: [] },
      isEnabled: { type: Boolean, default: false },
      type: { type: String, default: 'default' }
    },
    BadWordsFilter: {
      BDW: { type: Array, default: [] },
      isEnabled: { type: Boolean, default: false },
    },
    AntiLink: {
      isEnabled: { type: Boolean, default: false },
      whitelist: { type: Array, default: [] },
      blacklist: { type: Array, default: [] },
      scamDetection: { type: Boolean, default: true },
      allowedDomains: { type: Array, default: [] },
      action: { type: String, default: 'delete' }, // delete, mute, ban
      logChannel: { type: String, default: null }
    },
    AntiRaid: {
      isEnabled: { type: Boolean, default: false },
      maxJoinsPerMinute: { type: Number, default: 5 },
      minAccountAge: { type: Number, default: 86400000 }, // 24 hours in ms
      action: { type: String, default: 'mute' }, // mute, kick, ban
      logChannel: { type: String, default: null },
      lockdownDuration: { type: Number, default: 300000 } // 5 minutes in ms
    },
    AntiBot: {
      isEnabled: { type: Boolean, default: false },
      maxMessagesPerMinute: { type: Number, default: 10 },
      maxSameLinks: { type: Number, default: 3 },
      action: { type: String, default: 'mute' }, // mute, kick, ban
      logChannel: { type: String, default: null },
      suspiciousPatterns: { type: Array, default: [] }
    },
    AntiSpam: {
      isEnabled: { type: Boolean, default: false },
      maxCapsPercentage: { type: Number, default: 70 },
      minCapsLength: { type: Number, default: 5 },
      maxEmojis: { type: Number, default: 10 },
      maxDuplicates: { type: Number, default: 3 },
      action: { type: String, default: 'delete' }, // delete, mute, warn
      logChannel: { type: String, default: null }
    },
    Infraction: {
      isEnabled: { type: Boolean, default: false },
      Options: {
        banisEnabled: { type: Boolean, default: true },
        kickisEnabled: { type: Boolean, default: true },
        MaxbanP: { type: Number, default: 10 },
        MaxkickP: { type: Number, default: 5 }
      },
      TimeReset: { type: Number, default: 1800000 }
    }
  },

  greeter: {
    welcome: {
      isEnabled: { type: Boolean, default: false },
      channel: { type: String, default: null },
      message: { type: String, default: '{user} has joined {guildName} server!' },
      embed: {
        image: {
          url: {
            type: String,
            default: null
          }
        },
        thumbnail: {
          url: {
            type: String,
            default: '{avatarDynamic}'
          }
        },
        color: { type: String, default: null },
        title: { type: String, default: null },
        description: { type: String, default: '{user} has joined {guildName} server!' },
        footer: {
          text: { type: String, default: null },
          icon_url: { type: String, default: null },
        },
        author: {
          name: { type: String, default: null },
          url: { type: String, default: null },
          icon_url: { type: String, default: null },
        }
      },
      type: { type: String, default: 'default' }
    },
    leaving: {
      isEnabled: { type: Boolean, default: false },
      channel: { type: String, default: null },
      message: { type: String, default: '{user} has just leaved {guildName} server!' },
      embed: {
        image: {
          url: {
            type: String,
            default: null
          }
        },
        thumbnail: {
          url: {
            type: String,
            default: '{avatarDynamic}'
          }
        },
        color: { type: String, default: null },
        title: { type: String, default: null },
        description: { type: String, default: '{user} has just leaved {guildName} server!' },
        footer: {
          text: { type: String, default: null },
          icon_url: { type: String, default: null },
        },
        author: {
          name: { type: String, default: null },
          url: { type: String, default: null },
          icon_url: { type: String, default: null },
        }
      },
      type: { type: String, default: 'default' }
    }
  },
})

module.exports = mongoose.model('guildSettings', guildSchema)