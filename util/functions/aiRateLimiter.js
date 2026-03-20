/**
 * Rate Limiter for AI Chat
 * Prevents API abuse while maintaining good user experience
 */

class RateLimiter {
    constructor() {
        // Storage for user message timestamps
        this.userTimestamps = new Map();
        this.globalTimestamps = [];
        this.MAX_USER_CACHE_SIZE = 10000;
        this.MAX_GLOBAL_TIMESTAMPS = 2000;
        
        // Configuration
        this.config = {
            // Per-user limits
            user: {
                maxMessagesPerMinute: 5,
                maxMessagesPerHour: 30,
                cooldownMs: 5000 // 5 seconds between messages
            },
            // Global limits (across all users)
            global: {
                maxMessagesPerMinute: 60,
                maxMessagesPerHour: 500
            }
        };

        // Cleanup old entries every 10 minutes
        setInterval(() => this.cleanup(), 600000);
    }

    /**
     * Check if a user can send a message
     * @param {string} userId - Discord user ID
     * @returns {{allowed: boolean, reason?: string, retryAfter?: number}} Check result
     */
    canSend(userId) {
        const now = Date.now();
        const userKey = userId;

        // Initialize user entry if not exists
        if (!this.userTimestamps.has(userKey)) {
            this.userTimestamps.set(userKey, []);
        }

        const userTimestamps = this.userTimestamps.get(userKey);
        
        // Clean old entries (older than 1 hour)
        const oneHourAgo = now - 3600000;
        const validUserTimestamps = userTimestamps.filter(t => t > oneHourAgo);
        this.userTimestamps.set(userKey, validUserTimestamps);

        // Check user cooldown (minimum time between messages)
        const lastMessage = validUserTimestamps[validUserTimestamps.length - 1];
        if (lastMessage && (now - lastMessage) < this.config.user.cooldownMs) {
            const retryAfter = this.config.user.cooldownMs - (now - lastMessage);
            return {
                allowed: false,
                reason: "Please wait a moment before sending another message",
                retryAfter
            };
        }

        // Check user per-minute limit
        const oneMinuteAgo = now - 60000;
        const userMessagesLastMinute = validUserTimestamps.filter(t => t > oneMinuteAgo).length;
        if (userMessagesLastMinute >= this.config.user.maxMessagesPerMinute) {
            const oldestInMinute = validUserTimestamps.find(t => t > oneMinuteAgo);
            const retryAfter = 60000 - (now - oldestInMinute);
            return {
                allowed: false,
                reason: `You've reached the limit of ${this.config.user.maxMessagesPerMinute} messages per minute. Please slow down.`,
                retryAfter
            };
        }

        // Check user per-hour limit
        const userMessagesLastHour = validUserTimestamps.length;
        if (userMessagesLastHour >= this.config.user.maxMessagesPerHour) {
            const oldestInHour = validUserTimestamps[0];
            const retryAfter = 3600000 - (now - oldestInHour);
            return {
                allowed: false,
                reason: `You've reached the hourly limit of ${this.config.user.maxMessagesPerHour} messages. Please try again later.`,
                retryAfter
            };
        }

        // Clean and check global timestamps
        this.globalTimestamps = this.globalTimestamps.filter(t => t > oneHourAgo);
        
        const globalMessagesLastMinute = this.globalTimestamps.filter(t => t > oneMinuteAgo).length;
        if (globalMessagesLastMinute >= this.config.global.maxMessagesPerMinute) {
            return {
                allowed: false,
                reason: "The AI service is currently busy. Please try again in a moment.",
                retryAfter: 10000
            };
        }

        const globalMessagesLastHour = this.globalTimestamps.length;
        if (globalMessagesLastHour >= this.config.global.maxMessagesPerHour) {
            return {
                allowed: false,
                reason: "The AI service has reached its hourly capacity. Please try again later.",
                retryAfter: 300000
            };
        }

        return { allowed: true };
    }

    /**
     * Record a message being sent
     * @param {string} userId - Discord user ID
     */
    record(userId) {
        const now = Date.now();

        if (this.userTimestamps.size >= this.MAX_USER_CACHE_SIZE) {
            this.cleanup();
        }
        
        // Add to user timestamps
        const userTimestamps = this.userTimestamps.get(userId) || [];
        userTimestamps.push(now);
        this.userTimestamps.set(userId, userTimestamps);

        // Add to global timestamps
        this.globalTimestamps.push(now);
        if (this.globalTimestamps.length > this.MAX_GLOBAL_TIMESTAMPS) {
            this.globalTimestamps = this.globalTimestamps.slice(-this.MAX_GLOBAL_TIMESTAMPS);
        }
    }

    /**
     * Get current usage stats for a user
     * @param {string} userId - Discord user ID
     * @returns {{minute: number, hour: number}} Usage stats
     */
    getUserStats(userId) {
        const now = Date.now();
        const oneMinuteAgo = now - 60000;
        const oneHourAgo = now - 3600000;

        const userTimestamps = this.userTimestamps.get(userId) || [];
        const validTimestamps = userTimestamps.filter(t => t > oneHourAgo);

        return {
            minute: validTimestamps.filter(t => t > oneMinuteAgo).length,
            hour: validTimestamps.length,
            limitMinute: this.config.user.maxMessagesPerMinute,
            limitHour: this.config.user.maxMessagesPerHour
        };
    }

    /**
     * Cleanup old entries to prevent memory leaks
     */
    cleanup() {
        const now = Date.now();
        const oneHourAgo = now - 3600000;

        // Clean user timestamps
        for (const [userId, timestamps] of this.userTimestamps.entries()) {
            const valid = timestamps.filter(t => t > oneHourAgo);
            if (valid.length === 0) {
                this.userTimestamps.delete(userId);
            } else {
                this.userTimestamps.set(userId, valid);
            }
        }

        // Clean global timestamps
        this.globalTimestamps = this.globalTimestamps.filter(t => t > oneHourAgo);
    }

    /**
     * Format retry after time into human readable string
     * @param {number} ms - Milliseconds
     * @returns {string} Formatted time
     */
    formatRetryAfter(ms) {
        if (ms < 60000) {
            return `${Math.ceil(ms / 1000)} seconds`;
        } else if (ms < 3600000) {
            return `${Math.ceil(ms / 60000)} minutes`;
        } else {
            return `${Math.ceil(ms / 3600000)} hours`;
        }
    }
}

// Export singleton instance
module.exports = new RateLimiter();
