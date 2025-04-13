const schema = require('../../schema/reminder-Schema');
const { NotifyEmbed } = require("../modules/embeds");

// Configuration
const CONFIG = {
    GRACE_PERIOD: 300000,    // 5 minutes for late reminders
    CLEANUP_INTERVAL: 3600000 // 1 hour cleanup interval
};

// Send reminder and clean up
const sendReminder = async (client, reminder) => {
    try {
        const user = await client.users.fetch(reminder.userId).catch(() => null);
        if (!user) {
            await schema.deleteOne({ _id: reminder._id });
            return;
        }

        await user.send({ 
            embeds: [NotifyEmbed('⏰ Reminder!', `You asked me to remind you about:\n**${reminder.reason}**`)] 
        }).catch(() => console.log(`[Reminder] Failed to DM user ${reminder.userId}`));
        
        // Mark as inactive instead of deleting
        await schema.findByIdAndUpdate(reminder._id, { active: false });
    } catch (error) {
        console.error('[Reminder] Error sending reminder:', error);
    }
};

// Set new reminder
const setReminder = async (client, reminder) => {
    const delay = reminder.time - Date.now();
    
    if (delay <= 0 || isNaN(delay)) {
        await schema.findByIdAndUpdate(reminder._id, { active: false });
        return;
    }

    setTimeout(() => sendReminder(client, reminder), delay);
};

// Initialize reminders on bot start
const initReminders = async (client) => {
    try {
        const now = Date.now();
        const reminders = await schema.find({
            active: true,
            $or: [
                { time: { $gt: now } }, // Future reminders
                { 
                    time: { 
                        $gte: now - CONFIG.GRACE_PERIOD,
                        $lte: now 
                    } 
                } // Recently missed reminders
            ]
        });

        console.log(`[Reminder] Initializing ${reminders.length} reminders`);

        for (const reminder of reminders) {
            const delay = reminder.time - now;
            
            if (delay > 0) {
                setTimeout(() => sendReminder(client, reminder), delay);
            } else {
                await sendReminder(client, reminder);
            }
        }
    } catch (error) {
        console.error('[Reminder] Initialization error:', error);
    }
};

// Periodic cleanup of old reminders
const startCleanupInterval = (client) => {
    setInterval(async () => {
        try {
            const result = await schema.updateMany({
                time: { $lt: Date.now() - CONFIG.GRACE_PERIOD },
                active: true
            }, { active: false });
            
            if (result.modifiedCount > 0) {
                console.log(`[Reminder] Marked ${result.modifiedCount} old reminders as inactive`);
            }
        } catch (error) {
            console.error('[Reminder] Cleanup error:', error);
        }
    }, CONFIG.CLEANUP_INTERVAL);
};

module.exports = {
    sendReminder,
    setReminder,
    initReminders,
    startCleanupInterval
};