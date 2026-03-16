const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
    userId: { 
        type: String, 
        required: true,
        index: true
    },
    reminderId: {
        type: String,
        default: null,
        index: true
    },
    time: { 
        type: Number, 
        required: true,
        index: true 
    },
    reason: { 
        type: String, 
        required: true 
    },
    channelId: {
        type: String,
        required: false
    },
    guildId: {
        type: String,
        required: false
    },
    active: {
        type: Boolean,
        default: true,
        index: true
    },
    sent: {
        type: Boolean,
        default: false
    }
}, { 
    timestamps: true 
});

// Compound index for finding user's active reminders
reminderSchema.index({ userId: 1, active: 1 });
reminderSchema.index({ userId: 1, reminderId: 1 });

module.exports = mongoose.model('Reminder', reminderSchema);