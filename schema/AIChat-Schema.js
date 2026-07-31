const mongoose = require('mongoose');
const { DEFAULT_MODEL_ID } = require('../util/functions/aiModels');

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

    // Custom API key for using user's own OpenRouter API key
    customApiKey: {
        type: String,
        default: ""
    },

    // Custom API base URL (defaults to OpenRouter)
    customApiUrl: {
        type: String,
        default: "https://openrouter.ai/api/v1"
    },

    // Whether the user is using a custom API
    usesCustomApi: {
        type: Boolean,
        default: false
    },

    // Custom models for this user (stored as JSON string array)
    customModels: [{
        id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        provider: {
            type: String,
            default: "Custom"
        }
    }],

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
            default: DEFAULT_MODEL_ID
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

// Method to check if user has custom API configured
aiChatSchema.methods.hasCustomApi = function() {
    return this.usesCustomApi && this.customApiKey && this.customApiKey.trim().length > 0;
};

// Method to get all available models for this user (including custom ones)
aiChatSchema.methods.getAvailableModels = function() {
    const { getAvailableModels } = require('../util/functions/aiModels');
    const baseModels = getAvailableModels();
    
    if (this.hasCustomApi() && this.customModels.length > 0) {
        // Mix free models with custom models (user can use both)
        return [
            ...baseModels,
            ...this.customModels.map(m => ({
                id: m.id,
                name: `${m.name} (Custom)`,
                provider: m.provider || 'Custom'
            }))
        ];
    }
    
    return baseModels;
};

module.exports = mongoose.model('AIChat', aiChatSchema);