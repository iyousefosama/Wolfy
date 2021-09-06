const mongoose = require('mongoose')

 const guildSchema = new mongoose.Schema({
    GuildID: { 
        type: String,
        required: true
     },

    SuggestionChannel: { 
        type: String,
        isEnabled: { type: Boolean, default: true }
     },

     ReportsChannel: { 
      type: String,
      isEnabled: { type: Boolean, default: true }
   },

   LogsChannel: { 
      type: String,
      isEnabled: { type: Boolean, default: true }
   }
})

module.exports = mongoose.model('guildSettings', guildSchema)