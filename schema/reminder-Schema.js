const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
    userId: { 
        type: String, 
        required: true 
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
    }
}, { 
    timestamps: true 
});

// Create index for faster queries
reminderSchema.index({ userId: 1 });

module.exports = mongoose.model('Reminder', reminderSchema);