const schema = require('../../schema/reminder-Schema');
const aiService = require('./aiService');

/** Configuration Constants */
const CONFIG = {
    GRACE_PERIOD_MS: 5 * 60 * 1000,    // 5 minutes grace period for late reminders
    CLEANUP_INTERVAL_MS: 60 * 60 * 1000, // 1 hour cleanup interval
    MAX_ACTIVE_TIMEOUT_MS: 2147483647    // Max setTimeout value (prevent overflow)
};

/** Active timeout references for cleanup */
const activeTimers = new Map();

/**
 * Generate a friendly AI reminder message
 * @param {string} userId - Discord user ID
 * @param {string} reason - Reminder reason
 * @returns {string} AI-generated reminder message
 */
const generateReminderMessage = async (client, userId, reason) => {
    try {
        if (!aiService.isAvailable()) {
            // Fallback if AI is not available
            return `⏰ Hey <@${userId}>! You asked me to remind you about: **${reason}**`;
        }

        const systemPrompt = `You are Wolfy, a friendly AI assistant. Generate a brief, conversational reminder message.
Rules:
- Keep it under 100 characters
- Be friendly and casual
- Use 0-1 emojis
- Just acknowledge the reminder topic, don't be robotic
- Examples: "⏰ Time to water those plants!", "Hey, don't forget to call mom! 📞"`;

        const messages = [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Remind me about: "${reason}"` }
        ];

        const aiMessage = await aiService.chatComplete({ messages, model: aiService.defaultModel });
        
        if (aiMessage && aiMessage !== "No response received." && !aiMessage.includes("error")) {
            let formattedMessage = aiMessage.trim();
            // Ensure it mentions the user
            if (!formattedMessage.includes(`<@${userId}>`)) {
                formattedMessage = `⏰ <@${userId}> ${formattedMessage}`;
            }
            return formattedMessage;
        }
        
        // Fallback
        return `⏰ Hey <@${userId}>! You asked me to remind you about: **${reason}**`;
    } catch (error) {
        console.error('[Reminder] AI generation failed:', error.message);
        return `⏰ Hey <@${userId}>! You asked me to remind you about: **${reason}**`;
    }
};

/**
 * Send reminder notification to user
 * @param {Object} client - Discord client
 * @param {Object} reminder - Reminder document
 */
const sendReminder = async (client, reminder) => {
    // Clear timeout reference
    activeTimers.delete(reminder._id.toString());
    
    let sent = false;
    
    // Generate AI reminder message
    const reminderMessage = await generateReminderMessage(client, reminder.userId, reminder.reason);

    // Try channel first
    if (reminder.channelId) {
        try {
            const channel = await client.channels.fetch(reminder.channelId);
            if (channel?.send) {
                await channel.send({ content: reminderMessage });
                sent = true;
                console.log(`[Reminder] Sent to channel ${reminder.channelId}`);
            }
        } catch (error) {
            console.log(`[Reminder] Channel ${reminder.channelId} unavailable, trying DM...`);
        }
    }

    // Fallback to DM
    if (!sent) {
        try {
            const user = await client.users.fetch(reminder.userId);
            if (user) {
                await user.send({ content: reminderMessage });
                sent = true;
                console.log(`[Reminder] Sent via DM to ${reminder.userId}`);
            }
        } catch (error) {
            console.error(`[Reminder] Failed to DM user ${reminder.userId}`);
        }
    }

    // Mark as inactive and sent, then delete after a delay
    try {
        await schema.findByIdAndUpdate(reminder._id, { active: false, sent: true });
        console.log(`[Reminder] Marked as sent for user ${reminder.userId}`);
        
        // Delete the reminder after 5 seconds to ensure it was sent
        setTimeout(async () => {
            try {
                await schema.deleteOne({ _id: reminder._id });
                console.log(`[Reminder] Deleted reminder ${reminder._id}`);
            } catch (err) {
                // Silent fail - cleanup will handle it later
            }
        }, 5000);
    } catch (error) {
        console.error('[Reminder] Failed to update reminder status:', error.message);
    }
};

/**
 * Schedule a new reminder
 * @param {Object} client - Discord client
 * @param {Object} reminder - Reminder document
 */
const setReminder = (client, reminder) => {
    const delay = reminder.time - Date.now();
    
    // Validate delay
    if (delay <= 0 || isNaN(delay)) {
        schema.findByIdAndUpdate(reminder._id, { active: false }).catch(() => {});
        return;
    }

    // Handle extremely long delays (over ~24 days would overflow setTimeout)
    if (delay > CONFIG.MAX_ACTIVE_TIMEOUT_MS) {
        console.log(`[Reminder] Delay too long (${delay}ms), using interval approach`);
        const interval = setInterval(async () => {
            const currentReminder = await schema.findById(reminder._id);
            if (!currentReminder?.active) {
                clearInterval(interval);
                return;
            }
            if (Date.now() >= reminder.time) {
                clearInterval(interval);
                await sendReminder(client, reminder);
            }
        }, CONFIG.MAX_ACTIVE_TIMEOUT_MS);
        return;
    }

    // Normal timeout
    const timeout = setTimeout(() => sendReminder(client, reminder), delay);
    activeTimers.set(reminder._id.toString(), timeout);
};

/**
 * Clear all active reminder timeouts (useful for graceful shutdown)
 */
const clearAllTimers = () => {
    for (const [id, timer] of activeTimers) {
        clearTimeout(timer);
        activeTimers.delete(id);
    }
    console.log(`[Reminder] Cleared ${activeTimers.size} active timers`);
};

/**
 * Initialize reminders on bot startup
 * @param {Object} client - Discord client
 */
const initReminders = async (client) => {
    try {
        const now = Date.now();
        const reminders = await schema.find({
            active: true,
            $or: [
                { time: { $gt: now } },
                { time: { $gte: now - CONFIG.GRACE_PERIOD_MS, $lte: now } }
            ]
        }).lean();

        console.log(`[Reminder] Initializing ${reminders.length} reminders`);

        for (const reminder of reminders) {
            const delay = reminder.time - now;
            
            if (delay > 0) {
                setReminder(client, reminder);
            } else {
                // Missed reminder within grace period - send immediately
                await sendReminder(client, reminder);
            }
        }
    } catch (error) {
        console.error('[Reminder] Initialization error:', error.message);
    }
};

/**
 * Cancel a specific reminder by ID
 * @param {string} reminderId - Reminder document ID
 */
const cancelReminder = (reminderId) => {
    const timer = activeTimers.get(reminderId);
    if (timer) {
        clearTimeout(timer);
        activeTimers.delete(reminderId);
        console.log(`[Reminder] Cancelled timer for reminder ${reminderId}`);
        return true;
    }
    return false;
};

/**
 * Delete old inactive reminders from database (older than 7 days)
 * @param {number} days - Delete reminders older than this many days (default: 7)
 */
const deleteOldReminders = async (days = 7) => {
    try {
        const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
        const result = await schema.deleteMany({
            active: false,
            sent: true,
            updatedAt: { $lt: new Date(cutoff) }
        });
        
        if (result.deletedCount > 0) {
            console.log(`[Reminder] Deleted ${result.deletedCount} old inactive reminders`);
        }
        return result.deletedCount;
    } catch (error) {
        console.error('[Reminder] Error deleting old reminders:', error.message);
        return 0;
    }
};

/**
 * Start periodic cleanup of old reminders
 * @param {Object} client - Discord client
 */
const startCleanupInterval = () => {
    setInterval(async () => {
        try {
            // Mark old active reminders as inactive
            const result = await schema.updateMany(
                { time: { $lt: Date.now() - CONFIG.GRACE_PERIOD_MS }, active: true },
                { active: false }
            );
            
            if (result.modifiedCount > 0) {
                console.log(`[Reminder] Marked ${result.modifiedCount} old reminders as inactive`);
            }
            
            // Also delete old inactive reminders (older than 7 days)
            const deleted = await deleteOldReminders(7);
            if (deleted > 0) {
                console.log(`[Reminder] Deleted ${deleted} old inactive reminders`);
            }
        } catch (error) {
            console.error('[Reminder] Cleanup error:', error.message);
        }
    }, CONFIG.CLEANUP_INTERVAL_MS);
};

module.exports = {
    sendReminder,
    setReminder,
    initReminders,
    startCleanupInterval,
    clearAllTimers,
    cancelReminder,
    deleteOldReminders
};
