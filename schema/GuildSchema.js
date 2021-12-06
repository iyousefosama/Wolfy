const mongoose = require('mongoose')

 const guildSchema = new mongoose.Schema({
    GuildID: { 
        type: String,
        required: true
     },

     prefix: { type: String, default: null },
     blacklisted: { type: Boolean, default: false },
     
   Mod: {
      Suggestion: {
        isEnabled: { type: Boolean, default: false },
        channel: { type: String, default: null },
        type: { type: String, default: 'default' }
      },
      Reports: {
        isEnabled: { type: Boolean, default: false },
        channel: { type: String, default: null },
        type: { type: String, default: 'default' }
      },
      smroles: {
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
        type: { type: String, default: 'default' }
      },
      Logs: {
         isEnabled: { type: Boolean, default: false },
         channel: { type: String, default: null },
         type: { type: String, default: 'default' }
       },
       Level: {
        isEnabled: { type: Boolean, default: false },
        type: { type: String, default: 'default' }
      },
      BadWordsFilter: {
        BDW: { type: Array, default: [] },
        isEnabled: { type: Boolean, default: false },
      }
    },

    greeter: {
      welcome: {
        isEnabled: { type: Boolean, default: false },
        channel: { type: String, default: null },
        message: { type: String, default: null },
        embed: { type: Object, default: false },
        type: { type: String, default: 'default' }
      },
      leaving: {
        isEnabled: { type: Boolean, default: false },
        channel: { type: String, default: null },
        message: { type: String, default: null },
        embed: { type: Object, default: null },
        type: { type: String, default: 'default' }
      }
    },
})

module.exports = mongoose.model('guildSettings', guildSchema)