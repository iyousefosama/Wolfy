const mongoose = require('mongoose')


const UserSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },

    Status: {
      Blacklisted: {
        reason: { type: String, default: false },
        current: { type: Boolean, default: false }
      }
      },
})


module.exports = mongoose.model('user-info', UserSchema)