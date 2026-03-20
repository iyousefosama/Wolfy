const { ChannelType, PermissionsBitField } = require("discord.js");
const aiService = require("../../util/functions/aiService");
const rateLimiter = require("../../util/functions/aiRateLimiter");
const AIChatSchema = require("../../schema/AIChat-Schema");
const consoleUtil = require("../../util/console");

const BEV = require("../../util/types/baseEvents");

/** @type {BEV.BaseEvent<"messageCreate">} */
module.exports = {
    name: "messageCreate",
    async execute(client, message) {
        if (!aiService.isAvailable()) return;
        if (message.author.bot) return;
        if (!message.content || message.content.trim().length === 0) return;

        let prefix = client.prefix;
        if (message.guild) {
            try {
                const guildData = await client.getCachedGuildData(message.guild.id);
                if (guildData?.prefix) {
                    prefix = guildData.prefix;
                }
            } catch (err) {
                // Fall back to the default prefix if cache/database lookup fails.
            }
        }

        if (message.content.startsWith(prefix)) return;

        const isDM = message.channel.type === ChannelType.DM;
        const isMentioned = message.mentions.users.has(client.user.id);
        const isReplyToBot = message.reference?.messageId &&
            (await message.channel.messages.fetch(message.reference.messageId).catch(() => null))?.author?.id === client.user.id;

        const shouldRespond = isDM || (isMentioned && message.guild) || (isReplyToBot && message.guild);
        if (!shouldRespond) return;

        const rateCheck = rateLimiter.canSend(message.author.id);
        if (!rateCheck.allowed) {
            if (isDM) {
                await message.reply({
                    content: `â³ ${rateCheck.reason} (Try again in ${rateLimiter.formatRetryAfter(rateCheck.retryAfter)})`,
                    allowedMentions: { repliedUser: false }
                }).catch(() => {});
            }
            return;
        }

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
            }
        } catch (err) {
            consoleUtil.error(err, "AIChat-fetch-settings");
            return;
        }

        if (userSettings.moderation?.banned) {
            if (isDM) {
                await message.reply({
                    content: "âŒ You are not allowed to use the AI chat feature.",
                    allowedMentions: { repliedUser: false }
                }).catch(() => {});
            }
            return;
        }

        if (!userSettings.isEnabled) {
            return;
        }

        if (message.guild) {
            const botPermissions = message.channel.permissionsFor(message.guild.members.me);
            if (!botPermissions?.has(PermissionsBitField.Flags.SendMessages)) {
                return;
            }
            if (!botPermissions?.has(PermissionsBitField.Flags.ViewChannel)) {
                return;
            }
        }

        await message.channel.sendTyping().catch(() => {});

        let userMessage = message.content
            .replace(new RegExp(`<@!?${client.user.id}>`, 'g'), '')
            .trim();

        if (!userMessage) {
            userMessage = "Hello!";
        }

        const systemPrompt = aiService.buildSystemPrompt(client, userSettings.customInstructions);
        const messages = [
            { role: "system", content: systemPrompt },
            ...userSettings.getFormattedHistory(),
            { role: "user", content: userMessage }
        ];

        if (userSettings.preferences?.responseLength === 'short') {
            messages[0].content += "\n\nKeep your responses concise and brief (under 500 characters if possible).";
        } else if (userSettings.preferences?.responseLength === 'long') {
            messages[0].content += "\n\nProvide detailed and comprehensive responses.";
        }

        rateLimiter.record(message.author.id);

        try {
            let fullResponse = "";
            let completeResponse = "";
            let messageSent = false;
            let lastMessage = null;

            for await (const chunk of aiService.chatStream({
                messages,
                model: userSettings.preferences?.model || aiService.defaultModel
            })) {
                fullResponse += chunk;
                completeResponse += chunk;

                if (fullResponse.length > 1800) {
                    const contentToSend = fullResponse.substring(0, 1990);

                    if (!messageSent) {
                        lastMessage = await message.reply({
                            content: contentToSend + (fullResponse.length > 1990 ? "..." : "")
                        }).catch(() => null);
                        messageSent = true;
                    } else if (lastMessage) {
                        lastMessage = await message.reply({
                            content: contentToSend + (fullResponse.length > 1990 ? "..." : "")
                        }).catch(() => null);
                    }

                    fullResponse = "";
                }
            }

            if (fullResponse.trim()) {
                const finalResponse = fullResponse.length > 1990
                    ? fullResponse.substring(0, 1987) + "..."
                    : fullResponse;

                await message.reply({
                    content: finalResponse
                }).catch(() => {});
            } else if (!messageSent) {
                await message.reply({
                    content: "I'm not sure how to respond to that. Could you rephrase your question?"
                }).catch(() => {});
            }

            if (userSettings.preferences?.useHistory !== false) {
                await userSettings.addToHistory("user", userMessage);
                await userSettings.addToHistory(
                    "assistant",
                    completeResponse || fullResponse || "I'm not sure how to respond to that. Could you rephrase your question?"
                );
            }

        } catch (error) {
            consoleUtil.error(error, "AIChat-response");

            await message.reply({
                content: "âŒ Sorry, I encountered an error while generating a response. Please try again later."
            }).catch(() => {});
        }
    }
};
