const mongoose = require('mongoose')


const UserSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },

    blacklisted: {
        type: Boolean,
        default: false
    },

    timer: {
      suggestion: {
        timeout: { type: Date, default: null }
      },
      reports: {
          timeout: { type: Date, default: null }
        }
    }
})


module.exports = mongoose.model('user-info', UserSchema)