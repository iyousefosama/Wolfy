const ms = require('ms');
const ReminderSchema = require('../../schema/reminder-Schema');
const { setReminder, cancelReminder } = require('./reminder');

/**
 * AI Reminder Skill - Parses natural language and manages reminders
 * Supports multiple reminders per user, replacement, and cancellation
 */
class AIReminderSkill {
    constructor(client) {
        this.client = client;
    }

    /**
     * Parse time string to milliseconds with enhanced patterns
     * @param {string} timeStr - Time string like "5 minutes", "2h", "tomorrow"
     * @returns {number|null} Milliseconds or null if invalid
     */
    parseTime(timeStr) {
        const patterns = [
            { regex: /^(\d+)\s*(m|min|mins|minute|minutes)$/i, multiplier: 60000 },
            { regex: /^(\d+)\s*(h|hr|hrs|hour|hours)$/i, multiplier: 3600000 },
            { regex: /^(\d+)\s*(d|day|days)$/i, multiplier: 86400000 },
            { regex: /^(\d+)\s*(w|wk|week|weeks)$/i, multiplier: 604800000 },
        ];

        for (const pattern of patterns) {
            const match = timeStr.match(pattern.regex);
            if (match) {
                return parseInt(match[1]) * pattern.multiplier;
            }
        }

        // Try ms library as fallback
        const msValue = ms(timeStr);
        return msValue || null;
    }

    /**
     * Extract reminder details from user message
     * @param {string} userMessage - The user's message
     * @returns {Object|null} Parsed reminder details or null if not a reminder request
     */
    parseReminderRequest(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        // Keywords for setting reminders
        const setKeywords = [
            'remind me', 'set a reminder', 'create reminder', 'add reminder',
            'set reminder', 'make a reminder'
        ];
        
        // Keywords for listing reminders
        const listKeywords = [
            'my reminders', 'show reminders', 'list reminders', 
            'what reminders', 'active reminders', 'check reminders'
        ];
        
        // Keywords for cancelling
        const cancelKeywords = [
            'cancel reminder', 'delete reminder', 'remove reminder',
            'stop reminder', 'clear reminder'
        ];

        // Check intent
        const isSetRequest = setKeywords.some(kw => lowerMessage.includes(kw));
        const isListRequest = listKeywords.some(kw => lowerMessage.includes(kw));
        const isCancelRequest = cancelKeywords.some(kw => lowerMessage.includes(kw));

        if (!isSetRequest && !isListRequest && !isCancelRequest) {
            // Also check for simple "remind me to... in..." pattern
            if (!lowerMessage.includes('remind me to') && !lowerMessage.match(/remind me.*\d+\s*(min|hour|day)/)) {
                return null;
            }
            isSetRequest = true;
        }

        // Handle list request
        if (isListRequest) {
            return { action: 'list' };
        }

        // Handle cancel request - try to extract reminder identifier
        if (isCancelRequest) {
            const reminderId = this.extractReminderId(userMessage);
            return { 
                action: 'cancel',
                reminderId: reminderId
            };
        }

        // Handle set request
        return this.parseSetRequest(userMessage);
    }

    /**
     * Extract reminder ID/nickname from message
     * @param {string} message - User message
     * @returns {string|null} Reminder ID or null
     */
    extractReminderId(message) {
        // Match patterns like "cancel reminder 'work'" or "cancel the 'daily' reminder"
        const patterns = [
            /["']([^"']+)["']/,
            /reminder\s+(?:called|named|with id|#)?\s*(\w+)/i,
            /cancel\s+(?:the\s+)?(\w+)\s+reminder/i,
            /reminder\s+(\w+)$/i
        ];

        for (const pattern of patterns) {
            const match = message.match(pattern);
            if (match) return match[1].toLowerCase();
        }

        return null;
    }

    /**
     * Parse a reminder set request
     * @param {string} userMessage - User's message
     * @returns {Object|null} Parsed details
     */
    parseSetRequest(userMessage) {
        const timePatterns = [
            // "in 5 minutes", "after 2 hours"
            /(?:in|after)\s+(\d+\s*(?:minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w))/i,
            // "5 minutes from now"
            /(\d+\s*(?:minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w))\s+(?:from now|later)/i,
            // standalone "5m", "2 hours"
            /(\d+)\s*(m|min|mins|minute|minutes|h|hr|hour|hours|d|day|days|w|week|weeks)/i,
            // tomorrow
            /\btomorrow\b/i,
            // next week
            /\bnext\s+(week|month)\b/i,
        ];

        let timeString = null;
        let timeMs = null;
        let timeMatch = null;

        for (const pattern of timePatterns) {
            timeMatch = userMessage.match(pattern);
            if (timeMatch) {
                if (timeMatch[0].toLowerCase() === 'tomorrow') {
                    timeString = '1d';
                    timeMs = 86400000;
                } else if (timeMatch[0].toLowerCase().startsWith('next')) {
                    const unit = timeMatch[1].toLowerCase();
                    timeString = unit === 'week' ? '1w' : '30d';
                    timeMs = unit === 'week' ? 604800000 : 2592000000;
                } else {
                    timeString = timeMatch[1] + (timeMatch[2] || '');
                    timeMs = this.parseTime(timeString.replace(/\s+/g, ''));
                }
                break;
            }
        }

        if (!timeMs) {
            return null;
        }

        // Extract reason by removing time and reminder keywords
        let reason = userMessage;
        
        // Remove common patterns
        const patternsToRemove = [
            /remind me\s+(?:to|about|of)?/i,
            /set\s+(?:a\s+)?reminder\s+(?:to|for|about)?/i,
            /create\s+reminder\s+(?:to|for|about)?/i,
            /add\s+reminder\s+(?:to|for|about)?/i,
            timeMatch ? timeMatch[0] : null,
            /\s+/g
        ];

        patternsToRemove.forEach(pattern => {
            if (pattern) reason = reason.replace(pattern, ' ');
        });

        reason = reason.trim();
        
        // Clean up leftover words
        reason = reason
            .replace(/^(?:to|about|of|for|that|if)\s+/i, '')
            .replace(/^\s+|\s+$/g, '');

        if (!reason || reason.length < 2) {
            reason = 'something you wanted to be reminded about';
        }

        // Extract optional reminder ID
        const reminderId = this.extractReminderId(userMessage);

        return {
            action: 'set',
            timeString: timeString.replace(/\s+/g, ''),
            timeMs,
            reason,
            reminderId,
            isReminderRequest: true
        };
    }

    /**
     * Get user's active reminders
     * @param {string} userId - Discord user ID
     * @returns {Array} List of active reminders
     */
    async getUserReminders(userId) {
        return await ReminderSchema.find({
            userId: userId,
            active: true,
            time: { $gt: Date.now() }
        }).sort({ time: 1 });
    }

    /**
     * Cancel/delete a reminder
     * @param {string} userId - Discord user ID
     * @param {string} reminderId - Optional specific reminder ID
     * @returns {Object} Result
     */
    async cancelReminder(userId, reminderId = null) {
        try {
            let query = { userId, active: true };
            
            if (reminderId) {
                query.$or = [
                    { reminderId: reminderId.toLowerCase() },
                    { _id: reminderId }
                ];
            }

            const reminder = await ReminderSchema.findOne(query);
            
            if (!reminder) {
                return {
                    success: false,
                    error: reminderId 
                        ? `No active reminder found with ID "${reminderId}"`
                        : 'You have no active reminders to cancel'
                };
            }

            // Mark as inactive
            reminder.active = false;
            await reminder.save();

            // Try to cancel the timer
            if (cancelReminder) {
                cancelReminder(reminder._id.toString());
            }

            return {
                success: true,
                reminder: reminder,
                message: `Cancelled reminder: "${reminder.reason}"`
            };
        } catch (error) {
            console.error('[AI Reminder Skill] Error cancelling reminder:', error);
            return {
                success: false,
                error: 'Something went wrong while cancelling your reminder'
            };
        }
    }

    /**
     * Create or replace a reminder
     * @param {string} userId - Discord user ID
     * @param {string} channelId - Discord channel ID
     * @param {Object} reminderDetails - Parsed reminder details
     * @returns {Object} Result of reminder creation
     */
    async createReminder(userId, channelId, reminderDetails) {
        try {
            // Validate time constraints
            const maxTime = 30 * 24 * 60 * 60 * 1000; // 30 days
            const minTime = 30 * 1000; // 30 seconds

            if (reminderDetails.timeMs > maxTime) {
                return {
                    success: false,
                    error: 'I can only set reminders up to 30 days in the future.',
                    canProceed: false
                };
            }

            if (reminderDetails.timeMs < minTime) {
                return {
                    success: false,
                    error: 'Reminders must be at least 30 seconds in the future.',
                    canProceed: false
                };
            }

            const reminderTime = Date.now() + reminderDetails.timeMs;

            // Check if user wants to replace an existing reminder with same ID
            if (reminderDetails.reminderId) {
                const existing = await ReminderSchema.findOne({
                    userId: userId,
                    reminderId: reminderDetails.reminderId,
                    active: true
                });

                if (existing) {
                    // Cancel old reminder
                    existing.active = false;
                    await existing.save();
                    if (cancelReminder) {
                        cancelReminder(existing._id.toString());
                    }
                }
            }

            // Count user's active reminders
            const activeCount = await ReminderSchema.countDocuments({
                userId: userId,
                active: true
            });

            // Limit to 10 active reminders per user
            if (activeCount >= 10) {
                return {
                    success: false,
                    error: 'You can only have 10 active reminders at a time. Please cancel some first.',
                    canProceed: false
                };
            }

            // Create reminder document
            const reminder = await ReminderSchema.create({
                userId: userId,
                reminderId: reminderDetails.reminderId,
                time: reminderTime,
                reason: reminderDetails.reason,
                channelId: channelId,
                active: true,
                sent: false
            });

            // Set up the reminder timer
            setReminder(this.client, reminder);

            return {
                success: true,
                reminder: reminder,
                formattedTime: reminderDetails.timeString,
                isReplacement: reminderDetails.reminderId && activeCount > 0,
                canProceed: true
            };
        } catch (error) {
            console.error('[AI Reminder Skill] Error creating reminder:', error);
            return {
                success: false,
                error: 'Something went wrong while setting your reminder. Please try again or use the remind command.',
                canProceed: true
            };
        }
    }

    /**
     * Handle reminder request based on action type
     * @param {string} userMessage - The user's message
     * @param {string} userId - Discord user ID
     * @param {string} channelId - Discord channel ID
     * @param {string} guildId - Optional guild ID
     * @returns {Object|null} Reminder result or null if not a reminder request
     */
    async handleReminderRequest(userMessage, userId, channelId, guildId = null) {
        const parsed = this.parseReminderRequest(userMessage);
        
        if (!parsed) {
            return null;
        }

        // Handle list action
        if (parsed.action === 'list') {
            const reminders = await this.getUserReminders(userId);
            return {
                action: 'list',
                reminders: reminders,
                count: reminders.length,
                canProceed: true
            };
        }

        // Handle cancel action
        if (parsed.action === 'cancel') {
            const result = await this.cancelReminder(userId, parsed.reminderId);
            return {
                action: 'cancel',
                ...result,
                canProceed: true
            };
        }

        // Handle set action
        const result = await this.createReminder(userId, channelId, parsed);
        
        return {
            action: 'set',
            ...result,
            details: parsed
        };
    }
}

module.exports = AIReminderSkill;
