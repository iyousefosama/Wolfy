const { ChannelType, PermissionsBitField } = require("discord.js");
const aiService = require("../../util/functions/aiService");
const rateLimiter = require("../../util/functions/aiRateLimiter");
const AIChatSchema = require("../../schema/AIChat-Schema");
const consoleUtil = require("../../util/console");
const AIReminderSkill = require("../../util/functions/aiReminderSkill");

const BEV = require("../../util/types/baseEvents");

/** @type {BEV.BaseEvent<"messageCreate">} */
module.exports = {
    name: "messageCreate",
    async execute(client, message) {
        // Skip if AI service is not available
        if (!aiService.isAvailable()) return;

        // Skip bot messages
        if (message.author.bot) return;

        // Skip if message is empty
        if (!message.content || message.content.trim().length === 0) return;

        // Get the prefix (from guild or default)
        let prefix = client.prefix;
        if (message.guild) {
            try {
                const GuildSchema = require("../schema/GuildSchema");
                const guildData = await GuildSchema.findOne({ GuildID: message.guild.id });
                if (guildData?.prefix) {
                    prefix = guildData.prefix;
                }
            } catch (err) {
                // Use default prefix if DB query fails
            }
        }

        // Skip if message starts with prefix (it's a command)
        if (message.content.startsWith(prefix)) return;

        // Determine if we should respond
        const isDM = message.channel.type === ChannelType.DM;
        const isMentioned = message.mentions.users.has(client.user.id);
        const isReplyToBot = message.reference?.messageId && 
            (await message.channel.messages.fetch(message.reference.messageId).catch(() => null))?.author?.id === client.user.id;

        // Respond in DMs automatically, or when mentioned/replied to in guilds
        const shouldRespond = isDM || (isMentioned && message.guild) || (isReplyToBot && message.guild);
        
        if (!shouldRespond) return;

        // Check rate limits
        const rateCheck = rateLimiter.canSend(message.author.id);
        if (!rateCheck.allowed) {
            if (isDM) {
                await message.reply({
                    content: `⏳ ${rateCheck.reason} (Try again in ${rateLimiter.formatRetryAfter(rateCheck.retryAfter)})`,
                    allowedMentions: { repliedUser: false }
                }).catch(() => {});
            }
            return;
        }

        // Get or create user AI settings
        let userSettings;
        try {
            userSettings = await AIChatSchema.findOne({ userId: message.author.id });
            
            if (!userSettings) {
                userSettings = await AIChatSchema.create({
                    userId: message.author.id,
                    preferences: {
                        model: aiService.defaultModel
                    }
                });
            } else if (userSettings.preferences?.model === "qwen/qwen3-coder:free") {
                // Update old model to new default
                userSettings.preferences.model = aiService.defaultModel;
                await userSettings.save();
            }
        } catch (err) {
            consoleUtil.error(err, "AIChat-fetch-settings");
            return;
        }

        // Check if user is banned from using AI
        if (userSettings.moderation?.banned) {
            if (isDM) {
                await message.reply({
                    content: "❌ You are not allowed to use the AI chat feature.",
                    allowedMentions: { repliedUser: false }
                }).catch(() => {});
            }
            return;
        }

        // Check if AI is enabled for user
        if (!userSettings.isEnabled) {
            return;
        }

        // Check bot permissions in guild
        if (message.guild) {
            const botPermissions = message.channel.permissionsFor(message.guild.members.me);
            if (!botPermissions?.has(PermissionsBitField.Flags.SendMessages)) {
                return;
            }
            if (!botPermissions?.has(PermissionsBitField.Flags.ViewChannel)) {
                return;
            }
        }

        // Show typing indicator
        await message.channel.sendTyping().catch(() => {});

        // Clean message content (remove bot mentions)
        let userMessage = message.content
            .replace(new RegExp(`<@!?${client.user.id}>`, 'g'), '')
            .trim();

        if (!userMessage) {
            userMessage = "Hello!";
        }

        // Initialize reminder skill
        const reminderSkill = new AIReminderSkill(client);
        
        // Try to parse and handle reminder request
        let reminderResult = null;
        let reminderHandled = false;
        
        try {
            reminderResult = await reminderSkill.handleReminderRequest(
                userMessage, 
                message.author.id, 
                message.channel.id,
                message.guild?.id
            );
            
            // Handle different reminder actions
            if (reminderResult) {
                if (reminderResult.action === 'list') {
                    // List reminders - let AI handle the response
                    reminderHandled = false; // Let AI respond
                } else if (reminderResult.action === 'cancel') {
                    // Cancel reminder - show result immediately
                    if (reminderResult.success) {
                        await message.reply({
                            content: `✅ ${reminderResult.message}`
                        }).catch(() => {});
                    } else {
                        await message.reply({
                            content: `❌ ${reminderResult.error}`
                        }).catch(() => {});
                    }
                    reminderHandled = true;
                } else if (reminderResult.action === 'set') {
                    // Set reminder
                    if (!reminderResult.success) {
                        await message.reply({
                            content: `⏰ ${reminderResult.error}`
                        }).catch(() => {});
                        reminderHandled = true;
                    } else {
                        reminderHandled = false; // Let AI confirm
                    }
                }
            }
        } catch (err) {
            consoleUtil.error(err, "AIChat-reminder-parse");
        }

        // Build system prompt
        const systemPrompt = aiService.buildSystemPrompt(client, userSettings.customInstructions);

        // Add reminder context for AI
        let userMessageWithContext = userMessage;
        if (reminderResult) {
            if (reminderResult.action === 'set' && reminderResult.success) {
                const timeDisplay = reminderResult.details.timeString;
                const replacementNote = reminderResult.isReplacement ? ' (replaced existing reminder)' : '';
                userMessageWithContext += `

[System note: A reminder has been successfully scheduled${replacementNote} for "${reminderResult.details.reason}" in ${timeDisplay}. Please acknowledge this naturally in your response without repeating command syntax.]`;
            } else if (reminderResult.action === 'list' && reminderResult.reminders) {
                const remindersList = reminderResult.reminders.map((r, i) => 
                    `${i + 1}. "${r.reason}" - <t:${Math.floor(r.time/1000)}:R>${r.reminderId ? ` (ID: ${r.reminderId})` : ''}`
                ).join('\n');
                userMessageWithContext += `

[System note: User has ${reminderResult.count} active reminders:\n${remindersList || 'No active reminders'}\n\nRespond conversationally about their reminders.]`;
            }
        }

        // Build message array for AI
        const messages = [
            { role: "system", content: systemPrompt },
            ...userSettings.getFormattedHistory(),
            { role: "user", content: userMessageWithContext }
        ];

        // Add response length preference to system if needed
        if (userSettings.preferences?.responseLength === 'short') {
            messages[0].content += "\n\nKeep your responses concise and brief (under 500 characters if possible).";
        } else if (userSettings.preferences?.responseLength === 'long') {
            messages[0].content += "\n\nProvide detailed and comprehensive responses.";
        }

        // Record this request
        rateLimiter.record(message.author.id);

        try {
            // Collect streaming response
            let fullResponse = "";
            let messageSent = false;
            let lastMessage = null;

            // Stream the response
            for await (const chunk of aiService.chatStream({ 
                messages, 
                model: userSettings.preferences?.model || aiService.defaultModel
            })) {
                fullResponse += chunk;

                // Send new message if response is getting long (increased threshold)
                if (fullResponse.length > 1800) {
                    const contentToSend = fullResponse.substring(0, 1990); // Stay under Discord limit
                    
                    if (!messageSent) {
                        lastMessage = await message.reply({
                            content: contentToSend + (fullResponse.length > 1990 ? "..." : "")
                        }).catch(() => null);
                        messageSent = true;
                    } else if (lastMessage) {
                        // Send a new message replying to the original user message
                        lastMessage = await message.reply({
                            content: contentToSend + (fullResponse.length > 1990 ? "..." : "")
                        }).catch(() => null);
                    }
                    
                    fullResponse = ""; // Clear fullResponse after sending a message
                }
            }

            // Send final message if there's any remaining content in fullResponse
            if (fullResponse.trim()) {
                const finalResponse = fullResponse.length > 1990 
                    ? fullResponse.substring(0, 1987) + "..."
                    : fullResponse;

                await message.reply({
                    content: finalResponse
                }).catch(() => {});
            } else if (!messageSent) {
                // If no message was sent at all, send a default response
                await message.reply({
                    content: "I'm not sure how to respond to that. Could you rephrase your question?"
                }).catch(() => {});
            }

            // Save to conversation history if enabled
            if (userSettings.preferences?.useHistory !== false) {
                await userSettings.addToHistory("user", userMessage);
                // We need to reconstruct the full response since we cleared it after sending chunks
                // For now, skip saving assistant response if it was split into multiple messages
                // as we don't track the complete response across chunks
            }

        } catch (error) {
            consoleUtil.error(error, "AIChat-response");
            
            await message.reply({
                content: "❌ Sorry, I encountered an error while generating a response. Please try again later."
            }).catch(() => {});
        }
    }
};
