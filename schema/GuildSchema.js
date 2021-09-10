const mongoose = require('mongoose')

 const guildSchema = new mongoose.Schema({
    GuildID: { 
        type: String,
        required: true
     },

    SuggestionChannel: { 
        type: String, 
        default: null
     },

     ReportsChannel: { 
      type: String, 
      default: null
   },

   LogsChannel: { 
      type: String, 
      default: null
   },

   ToggleSuggestionChannel: {
      type: Boolean,
      default: true
   },

   ToggleReportsChannel: {
      type: Boolean,
      default: true
   },

   ToggleLogsChannel: {
      type: Boolean,
      default: true
   }
})

module.exports = mongoose.model('guildSettings', guildSchema)
