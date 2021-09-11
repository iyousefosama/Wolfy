const mongoose = require('mongoose')

 const guildSchema = new mongoose.Schema({
    GuildID: { 
        type: String,
        required: true
     },

     prefix: { type: String, default: null },

   Mod: {
      Suggestion: {
        isEnabled: { type: Boolean, default: true },
        channel: { type: String, default: null },
        type: { type: String, default: 'default' }
      },
      Reports: {
        isEnabled: { type: Boolean, default: true },
        channel: { type: String, default: null },
        type: { type: String, default: 'default' }
      },
      Logs: {
         isEnabled: { type: Boolean, default: true },
         channel: { type: String, default: null },
         type: { type: String, default: 'default' }
       }
    }
})

module.exports = mongoose.model('guildSettings', guildSchema)
