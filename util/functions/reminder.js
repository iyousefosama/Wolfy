const schema = require('../../schema/reminder-Schema');
const { EmbedBuilder } = require("discord.js");

// Configuration
const CONFIG = {
    GRACE_PERIOD: 300000,    // 5 minutes for late reminders
    CLEANUP_INTERVAL: 3600000 // 1 hour cleanup interval
};

// Embed template
const reminderEmbed = (reason) => new EmbedBuilder()
    .setTitle('⏰ Reminder!')
    .setDescription(`You asked me to remind you about:\n**${reason}**`)
    .setColor('Yellow')
    .setTimestamp();

// Send reminder and clean up
const sendReminder = async (client, reminder) => {
    try {
        const user = await client.users.fetch(reminder.userId).catch(() => null);
        if (!user) {
            await schema.deleteOne({ _id: reminder._id });
            return;
        }

        await user.send({ embeds: [reminderEmbed(reminder.reason)] })
            .catch(() => console.log(`[Reminder] Failed to DM user ${reminder.userId}`));
        
        await schema.deleteOne({ _id: reminder._id });
    } catch (error) {
        console.error('[Reminder] Error sending reminder:', error);
    }
};

// Set new reminder
const setReminder = async (client, reminder) => {
    const delay = reminder.time - Date.now();
    
    if (delay <= 0 || isNaN(delay)) {
        await schema.deleteOne({ _id: reminder._id });
        return;
    }

    setTimeout(() => sendReminder(client, reminder), delay);
};

// Initialize reminders on bot start
const initReminders = async (client) => {
    try {
        const now = Date.now();
        const reminders = await schema.find({
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
            const result = await schema.deleteMany({
                time: { $lt: Date.now() - CONFIG.GRACE_PERIOD }
            });
            if (result.deletedCount > 0) {
                console.log(`[Reminder] Cleaned up ${result.deletedCount} old reminders`);
            }
        } catch (error) {
            console.error('[Reminder] Cleanup error:', error);
        }
    }, CONFIG.CLEANUP_INTERVAL);
};

module.exports = {
    setReminder,
    initReminders,
    reminderEmbed,
    startCleanupInterval
};