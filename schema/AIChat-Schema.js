const mongoose = require('mongoose');

const aiChatSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    
    // User's custom instructions for the AI
    customInstructions: {
        type: String,
        default: "",
        maxlength: 2000
    },

    // Whether AI chat is enabled for this user
    isEnabled: {
        type: Boolean,
        default: true
    },

    // Conversation history for context (limited to last 10 messages)
    conversationHistory: [{
        role: {
            type: String,
            enum: ['user', 'assistant'],
            required: true
        },
        content: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],

    // User preferences
    preferences: {
        // Preferred AI model
        model: {
            type: String,
            default: "arcee-ai/trinity-large-preview:free"
        },
        // Whether to include conversation history
        useHistory: {
            type: Boolean,
            default: true
        },
        // Maximum response length preference
        responseLength: {
            type: String,
            enum: ['short', 'medium', 'long'],
            default: 'medium'
        }
    },

    // Usage statistics
    stats: {
        totalMessages: {
            type: Number,
            default: 0
        },
        lastMessageAt: {
            type: Date,
            default: null
        },
        firstUsedAt: {
            type: Date,
            default: Date.now
        }
    },

    // Moderation
    moderation: {
        // If user has been flagged for violating instructions policy
        flagged: {
            type: Boolean,
            default: false
        },
        flagReason: {
            type: String,
            default: null
        },
        // If user is banned from using AI
        banned: {
            type: Boolean,
            default: false
        },
        banReason: {
            type: String,
            default: null
        }
    }
}, {
    timestamps: true
});

// Method to add message to history
aiChatSchema.methods.addToHistory = function(role, content) {
    this.conversationHistory.push({ role, content });
    
    // Keep only last 10 messages
    if (this.conversationHistory.length > 10) {
        this.conversationHistory = this.conversationHistory.slice(-10);
    }
    
    // Update stats
    this.stats.totalMessages++;
    this.stats.lastMessageAt = new Date();
    
    return this.save();
};

// Method to clear history
aiChatSchema.methods.clearHistory = function() {
    this.conversationHistory = [];
    return this.save();
};

// Method to get formatted history for OpenRouter
aiChatSchema.methods.getFormattedHistory = function() {
    return this.conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
    }));
};

module.exports = mongoose.model('AIChat', aiChatSchema);
