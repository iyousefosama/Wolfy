const { PermissionFlagsBits } = require("discord.js");
const aiService = require("../../util/functions/aiService");
const AIChatSchema = require("../../schema/AIChat-Schema");
const rateLimiter = require("../../util/functions/aiRateLimiter");

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
    data: {
        name: "ai",
        description: "AI Chat settings and management",
        dmOnly: false,
        guildOnly: false,
        cooldown: 5,
        group: "Utility",
        requiresDatabase: true,
        clientPermissions: [],
        permissions: [],
        options: [
            {
                type: 1, // SUB_COMMAND
                name: "instructions",
                description: "Set custom instructions for the AI",
                options: [
                    {
                        type: 3, // STRING
                        name: "text",
                        description: "Your custom instructions for the AI (max 2000 chars)",
                        required: true,
                        max_length: 2000
                    }
                ]
            },
            {
                type: 1, // SUB_COMMAND
                name: "clear-instructions",
                description: "Clear your custom AI instructions"
            },
            {
                type: 1, // SUB_COMMAND
                name: "clear-history",
                description: "Clear your conversation history with the AI"
            },
            {
                type: 1, // SUB_COMMAND
                name: "toggle",
                description: "Enable or disable AI chat for yourself",
                options: [
                    {
                        type: 5, // BOOLEAN
                        name: "enabled",
                        description: "Enable AI chat?",
                        required: true
                    }
                ]
            },
            {
                type: 1, // SUB_COMMAND
                name: "settings",
                description: "View your current AI settings"
            },
            {
                type: 1, // SUB_COMMAND
                name: "stats",
                description: "View your AI usage statistics"
            },
            {
                type: 1, // SUB_COMMAND
                name: "model",
                description: "Change the AI model (free models only)",
                options: [
                    {
                        type: 3, // STRING
                        name: "name",
                        description: "The free model to use",
                        required: true,
                        choices: [
                            { name: "Trinity Large Preview (Free)", value: "arcee-ai/trinity-large-preview:free" },
                            { name: "Qwen 3 Coder (Free)", value: "qwen/qwen3-coder:free" },
                            { name: "Step 3.5 Flash (Free)", value: "stepfun/step-3.5-flash:free" },
                            { name: "GLM 4.5 Air (Free)", value: "z-ai/glm-4.5-air:free" },
                            { name: "Llama 3.3 70B Instruct (Free)", value: "meta-llama/llama-3.3-70b-instruct:free" },
                            { name: "GPT-OSS 120B (Free)", value: "openai/gpt-oss-120b:free" }
                        ]
                    }
                ]
            },
            {
                type: 1, // SUB_COMMAND
                name: "length",
                description: "Set preferred response length",
                options: [
                    {
                        type: 3, // STRING
                        name: "preference",
                        description: "Response length preference",
                        required: true,
                        choices: [
                            { name: "Short (concise replies)", value: "short" },
                            { name: "Medium (balanced)", value: "medium" },
                            { name: "Long (detailed replies)", value: "long" }
                        ]
                    }
                ]
            }
        ]
    },
    async execute(client, interaction) {
        const subcommand = interaction.options.getSubcommand();

        // Check if AI service is available
        if (!aiService.isAvailable() && subcommand !== "stats" && subcommand !== "settings") {
            return interaction.reply({
                content: "❌ AI service is currently unavailable. Please contact the bot owner.",
                ephemeral: true
            });
        }

        // Get or create user settings
        let userSettings;
        try {
            userSettings = await AIChatSchema.findOne({ userId: interaction.user.id });
            
            if (!userSettings) {
                userSettings = await AIChatSchema.create({
                    userId: interaction.user.id
                });
            }
        } catch (err) {
            console.error("[AI Command] Error fetching user settings:", err);
            return interaction.reply({
                content: "❌ An error occurred while accessing your settings. Please try again later.",
                ephemeral: true
            });
        }

        switch (subcommand) {
            case "instructions": {
                const instructions = interaction.options.getString("text");
                
                // Validate instructions
                const validation = aiService.validateInstructions(instructions);
                if (!validation.valid) {
                    return interaction.reply({
                        content: `❌ Invalid instructions: ${validation.reason}`,
                        ephemeral: true
                    });
                }

                // Update instructions
                userSettings.customInstructions = instructions;
                await userSettings.save();

                return interaction.reply({
                    content: "✅ Your custom AI instructions have been set! The AI will now follow these guidelines when responding to you.",
                    ephemeral: true
                });
            }

            case "clear-instructions": {
                userSettings.customInstructions = "";
                await userSettings.save();

                return interaction.reply({
                    content: "✅ Your custom AI instructions have been cleared. The AI will now use default behavior.",
                    ephemeral: true
                });
            }

            case "clear-history": {
                await userSettings.clearHistory();

                return interaction.reply({
                    content: "✅ Your conversation history with the AI has been cleared.",
                    ephemeral: true
                });
            }

            case "toggle": {
                const enabled = interaction.options.getBoolean("enabled");
                
                userSettings.isEnabled = enabled;
                await userSettings.save();

                return interaction.reply({
                    content: enabled 
                        ? "✅ AI chat has been **enabled** for you. You can now chat with me in DMs or by mentioning me!"
                        : "✅ AI chat has been **disabled** for you. I won't respond to your messages anymore.",
                    ephemeral: true
                });
            }

            case "settings": {
                const settings = userSettings.preferences;
                
                return interaction.reply({
                    embeds: [{
                        title: "🤖 Your AI Settings",
                        color: 0x5865F2,
                        fields: [
                            {
                                name: "AI Status",
                                value: userSettings.isEnabled ? "🟢 Enabled" : "🔴 Disabled",
                                inline: true
                            },
                            {
                                name: "Model",
                                value: settings?.model || "qwen/qwen3-coder:free",
                                inline: true
                            },
                            {
                                name: "Response Length",
                                value: settings?.responseLength || "medium",
                                inline: true
                            },
                            {
                                name: "Custom Instructions",
                                value: userSettings.customInstructions 
                                    ? `Set (${userSettings.customInstructions.length} chars)`
                                    : "Not set",
                                inline: true
                            },
                            {
                                name: "Conversation History",
                                value: `${userSettings.conversationHistory.length} messages stored`,
                                inline: true
                            }
                        ],
                        footer: {
                            text: "Use /ai commands to modify these settings"
                        },
                        timestamp: new Date()
                    }],
                    ephemeral: true
                });
            }

            case "stats": {
                const stats = userSettings.stats;
                const rateStats = rateLimiter.getUserStats(interaction.user.id);

                return interaction.reply({
                    embeds: [{
                        title: "📊 Your AI Usage Statistics",
                        color: 0x5865F2,
                        fields: [
                            {
                                name: "Total Messages",
                                value: stats.totalMessages.toString(),
                                inline: true
                            },
                            {
                                name: "First Used",
                                value: stats.firstUsedAt 
                                    ? `<t:${Math.floor(stats.firstUsedAt.getTime() / 1000)}:R>`
                                    : "Never",
                                inline: true
                            },
                            {
                                name: "Last Message",
                                value: stats.lastMessageAt
                                    ? `<t:${Math.floor(stats.lastMessageAt.getTime() / 1000)}:R>`
                                    : "Never",
                                inline: true
                            },
                            {
                                name: "Rate Limit Status",
                                value: `${rateStats.minute}/${rateStats.limitMinute} per minute\n${rateStats.hour}/${rateStats.limitHour} per hour`,
                                inline: false
                            }
                        ],
                        footer: {
                            text: "Rate limits reset automatically"
                        },
                        timestamp: new Date()
                    }],
                    ephemeral: true
                });
            }

            case "model": {
                const model = interaction.options.getString("name");
                
                // Validate the model is in the free list
                if (!aiService.isValidModel(model)) {
                    return interaction.reply({
                        content: "❌ Invalid or non-free model selected. Please choose from the available free models.",
                        ephemeral: true
                    });
                }
                
                userSettings.preferences.model = model;
                await userSettings.save();

                return interaction.reply({
                    content: `✅ AI model changed to: \`${model}\` (Free tier)`,
                    ephemeral: true
                });
            }

            case "length": {
                const preference = interaction.options.getString("preference");
                
                userSettings.preferences.responseLength = preference;
                await userSettings.save();

                const descriptions = {
                    short: "concise and brief responses",
                    medium: "balanced length responses",
                    long: "detailed and comprehensive responses"
                };

                return interaction.reply({
                    content: `✅ Response length preference set to **${preference}** (${descriptions[preference]}).`,
                    ephemeral: true
                });
            }

            default:
                return interaction.reply({
                    content: "❌ Unknown subcommand.",
                    ephemeral: true
                });
        }
    }
};
