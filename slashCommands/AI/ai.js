const { PermissionFlagsBits } = require("discord.js");
const aiService = require("../../util/functions/aiService");
const AIChatSchema = require("../../schema/AIChat-Schema");
const rateLimiter = require("../../util/functions/aiRateLimiter");
const { DEFAULT_MODEL_ID, getSlashCommandChoices } = require("../../util/functions/aiModels");
const { sendAiResponse } = require("../../util/functions/aiConversation");
const { colors } = require("../../util/constants/constants");

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
    data: {
        name: "ai",
        description: "AI Chat settings, management, and information",
        dmOnly: false,
        guildOnly: false,
        cooldown: 5,
        group: "Utility",
        integration_types: [0, 1],
        contexts: [0, 1, 2],
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
                description: "Change the AI model (free models only, or custom models if using custom API)",
                options: [
                    {
                        type: 3, // STRING
                        name: "name",
                        description: "The model to use",
                        required: true,
                        // Choices will be dynamically set based on user's custom API status
                        choices: getSlashCommandChoices()
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
            },
            {
                type: 1, // SUB_COMMAND
                name: "chat",
                description: "Send a prompt to the AI in this channel so everyone can see the reply",
                options: [
                    {
                        type: 3,
                        name: "prompt",
                        description: "The prompt to send to the AI",
                        required: true,
                        max_length: 2000
                    }
                ]
            },
            // === NEW SUBCOMMANDS ===
            {
                type: 1, // SUB_COMMAND
                name: "set-api",
                description: "Set your custom OpenRouter API key to use your own models and credits",
                options: [
                    {
                        type: 3, // STRING
                        name: "key",
                        description: "Your OpenRouter API key (starts with 'sk-or-')",
                        required: true
                    },
                    {
                        type: 3, // STRING
                        name: "base-url",
                        description: "Custom API base URL (default: https://openrouter.ai/api/v1)",
                        required: false
                    }
                ]
            },
            {
                type: 1, // SUB_COMMAND
                name: "remove-api",
                description: "Remove your custom API key and revert to using the bot's free AI"
            },
            {
                type: 1, // SUB_COMMAND
                name: "set-custom-model",
                description: "Add a custom model to use with your custom API key",
                options: [
                    {
                        type: 3, // STRING
                        name: "model-id",
                        description: "The model ID from OpenRouter (e.g., 'openai/gpt-4o')",
                        required: true
                    },
                    {
                        type: 3, // STRING
                        name: "display-name",
                        description: "A friendly name for this model (default: model-id)",
                        required: false,
                        max_length: 100
                    }
                ]
            },
            {
                type: 1, // SUB_COMMAND
                name: "remove-custom-model",
                description: "Remove a custom model from your list",
                options: [
                    {
                        type: 3, // STRING
                        name: "model-id",
                        description: "The model ID to remove",
                        required: true
                    }
                ]
            },
            {
                type: 1, // SUB_COMMAND
                name: "list-custom-models",
                description: "List all your custom models registered with your API key"
            },
            {
                type: 1, // SUB_COMMAND
                name: "how-to-use",
                description: "Learn how to use Wolfy AI for free or with your own API key"
            }
        ]
    },
    async execute(client, interaction) {
        const subcommand = interaction.options.getSubcommand();

        // Commands that don't need AI service
        const noServiceNeeded = ["stats", "settings", "how-to-use", "set-api", "remove-api", "set-custom-model", "remove-custom-model", "list-custom-models"];

        // Check if AI service is available (except for commands that don't need it)
        if (!aiService.isAvailable() && !noServiceNeeded.includes(subcommand)) {
            return interaction.reply({
                content: "❌ AI service is currently unavailable. Please contact the bot owner.",
                flags: ['Ephemeral']
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
                flags: ['Ephemeral']
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
                        flags: ['Ephemeral']
                    });
                }

                // Update instructions
                userSettings.customInstructions = instructions;
                await userSettings.save();

                return interaction.reply({
                    content: "✅ Your custom AI instructions have been set! The AI will now follow these guidelines when responding to you.",
                    flags: ['Ephemeral']
                });
            }

            case "clear-instructions": {
                userSettings.customInstructions = "";
                await userSettings.save();

                return interaction.reply({
                    content: "✅ Your custom AI instructions have been cleared. The AI will now use default behavior.",
                    flags: ['Ephemeral']
                });
            }

            case "clear-history": {
                await userSettings.clearHistory();

                return interaction.reply({
                    content: "✅ Your conversation history with the AI has been cleared.",
                    flags: ['Ephemeral']
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
                    flags: ['Ephemeral']
                });
            }

            case "settings": {
                const settings = userSettings.preferences;

                const currentModel = settings?.model || DEFAULT_MODEL_ID;
                const modelLabel = aiService.getModelDisplayName(currentModel);
                const hasCustomApi = userSettings.hasCustomApi();

                const fields = [
                    {
                        name: "AI Status",
                        value: userSettings.isEnabled ? "🟢 Enabled" : "🔴 Disabled",
                        inline: true
                    },
                    {
                        name: "Model",
                        value: modelLabel,
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
                    },
                    {
                        name: "Custom API Key",
                        value: hasCustomApi
                            ? "✅ Configured (your own API key)"
                            : "❌ Not set (using bot's free AI)",
                        inline: true
                    }
                ];

                // Add custom models info if user has custom API
                if (hasCustomApi && userSettings.customModels.length > 0) {
                    const customModelList = userSettings.customModels
                        .slice(0, 5)
                        .map(m => `• \`${m.id}\`${m.name !== m.id ? ` (${m.name})` : ''}`)
                        .join('\n');
                    
                    fields.push({
                        name: `Custom Models (${userSettings.customModels.length})`,
                        value: customModelList || "None configured",
                        inline: false
                    });
                }

                return interaction.reply({
                    embeds: [{
                        title: "🤖 Your AI Settings",
                        color: colors.AI,
                        fields,
                        footer: {
                            text: "Use /ai commands to modify these settings"
                        },
                        timestamp: new Date()
                    }],
                    flags: ['Ephemeral']
                });
            }

            case "stats": {
                const stats = userSettings.stats;
                const rateStats = rateLimiter.getUserStats(interaction.user.id);

                return interaction.reply({
                    embeds: [{
                        title: "📊 Your AI Usage Statistics",
                        color: colors.AI,
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
                    flags: ['Ephemeral']
                });
            }

            case "model": {
                const model = interaction.options.getString("name");
                const hasCustomApi = userSettings.hasCustomApi();

                // If user has custom API, they can use any model (including custom ones)
                if (hasCustomApi) {
                    // Check if it's a custom model or a free model
                    const isCustomModel = userSettings.customModels.some(m => m.id === model);
                    const isFreeModel = aiService.isValidModel(model);

                    if (!isCustomModel && !isFreeModel && model !== DEFAULT_MODEL_ID) {
                        return interaction.reply({
                            content: "❌ Model not found. Use `/ai list-custom-models` to see your available models, or add it with `/ai set-custom-model`.",
                            flags: ['Ephemeral']
                        });
                    }

                    userSettings.preferences.model = model;
                    await userSettings.save();

                    const modelDisplayName = isCustomModel
                        ? userSettings.customModels.find(m => m.id === model)?.name || model
                        : aiService.getModelDisplayName(model);

                    return interaction.reply({
                        content: `✅ AI model changed to: \`${modelDisplayName}\` (using your custom API)`,
                        flags: ['Ephemeral']
                    });
                }

                // Default behavior: only free models
                if (!aiService.isValidModel(model)) {
                    return interaction.reply({
                        content: "❌ Invalid or non-free model selected. Please choose from the available free models, or set up your own API key with `/ai set-api` to use custom models.",
                        flags: ['Ephemeral']
                    });
                }

                userSettings.preferences.model = model;
                await userSettings.save();

                const modelDisplayName = aiService.getModelDisplayName(model);
                const isAutoModel = model === "auto" || model === "openrouter/auto" || model === "openrouter/free";
                const suffix = isAutoModel ? " (uses the default free model automatically)" : " (Free tier)";

                return interaction.reply({
                    content: `✅ AI model changed to: \`${modelDisplayName}\`${suffix}`,
                    flags: ['Ephemeral']
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
                    flags: ['Ephemeral']
                });
            }

            case "chat": {
                const prompt = interaction.options.getString("prompt");

                if (!prompt || !prompt.trim()) {
                    return interaction.reply({
                        content: "❌ Please provide a prompt to send to the AI.",
                        flags: ['Ephemeral']
                    });
                }

                await interaction.deferReply();
                rateLimiter.record(interaction.user.id);

                try {
                    // Create a wrapper object that simulates a Discord message for sendAiResponse
                    const fakeMessage = {
                        reply: async (payload) => {
                            // Check if we've already sent a reply
                            if (!interaction.replied) {
                                return interaction.editReply(payload);
                            } else {
                                return interaction.followUp(payload);
                            }
                        },
                        channel: interaction.channel
                    };

                    const responseText = await sendAiResponse({
                        client,
                        message: fakeMessage,
                        userSettings,
                        userMessage: prompt.trim(),
                        replyToMessage: fakeMessage,
                        aiServiceInstance: aiService
                    });

                    if (userSettings.preferences?.useHistory !== false) {
                        await userSettings.addToHistory("user", prompt.trim());
                        await userSettings.addToHistory("assistant", responseText);
                    }

                    return;
                } catch (error) {
                    console.error("[AI Command] Chat error:", error);
                    return interaction.followUp({
                        content: "❌ Sorry, I encountered an error while generating a response."
                    });
                }
            }

            // === NEW COMMAND HANDLERS ===

            case "set-api": {
                const apiKey = interaction.options.getString("key").trim();
                const baseUrl = interaction.options.getString("base-url")?.trim() || "https://openrouter.ai/api/v1";

                // Validate API key format
                if (!apiKey.startsWith("sk-or-") && !apiKey.startsWith("sk-")) {
                    return interaction.reply({
                        content: "❌ Invalid API key format. OpenRouter API keys typically start with `sk-or-`. Please check your key and try again.\n\n> You can get an API key from: https://openrouter.ai/keys",
                        flags: ['Ephemeral']
                    });
                }

                if (apiKey.length < 20) {
                    return interaction.reply({
                        content: "❌ The API key seems too short. Please make sure you've entered the full key correctly.",
                        flags: ['Ephemeral']
                    });
                }

                // Test the API key by creating a custom client
                const testClient = aiService.createCustomClient(apiKey, baseUrl);
                if (!testClient) {
                    return interaction.reply({
                        content: "❌ Failed to initialize your custom API connection. The URL format may be invalid.",
                        flags: ['Ephemeral']
                    });
                }

                // Save the API key
                userSettings.customApiKey = apiKey;
                userSettings.customApiUrl = baseUrl;
                userSettings.usesCustomApi = true;
                await userSettings.save();

                const maskedKey = apiKey.substring(0, 8) + "..." + apiKey.slice(-4);

                return interaction.reply({
                    content: `✅ **Custom API key configured successfully!**\n\n` +
                        `🔑 Key: \`${maskedKey}\`\n` +
                        `🌐 URL: \`${baseUrl}\`\n\n` +
                        `You can now use \`/ai set-custom-model\` to add models from OpenRouter.\n` +
                        `Use \`/ai model\` to switch between your custom models.\n\n` +
                        `> ⚠️ **Note:** Your API key is stored securely and only used for your AI requests.`,
                    flags: ['Ephemeral']
                });
            }

            case "remove-api": {
                if (!userSettings.hasCustomApi()) {
                    return interaction.reply({
                        content: "❌ You don't have a custom API key configured. Use `/ai set-api` to add one.",
                        flags: ['Ephemeral']
                    });
                }

                // Clear API data
                userSettings.customApiKey = "";
                userSettings.customApiUrl = "https://openrouter.ai/api/v1";
                userSettings.usesCustomApi = false;
                userSettings.customModels = [];
                // Reset model to default
                userSettings.preferences.model = DEFAULT_MODEL_ID;
                await userSettings.save();

                return interaction.reply({
                    content: "✅ **Custom API key removed.**\n\nYou are now using the bot's free AI service again. Your model has been reset to Auto (Free).\n\n> Use `/ai how-to-use` to learn more about using the AI for free or with your own API.",
                    flags: ['Ephemeral']
                });
            }

            case "set-custom-model": {
                if (!userSettings.hasCustomApi()) {
                    return interaction.reply({
                        content: "❌ You need to set up a custom API key first with `/ai set-api` before you can add custom models.",
                        flags: ['Ephemeral']
                    });
                }

                const modelId = interaction.options.getString("model-id").trim();
                const displayName = interaction.options.getString("display-name")?.trim() || modelId;

                // Basic model ID validation
                if (!modelId.includes('/')) {
                    return interaction.reply({
                        content: "❌ Invalid model ID format. OpenRouter model IDs look like `provider/model-name` (e.g., `openai/gpt-4o`, `anthropic/claude-3-opus`).\n\n> Browse available models: https://openrouter.ai/models",
                        flags: ['Ephemeral']
                    });
                }

                if (modelId.length > 200) {
                    return interaction.reply({
                        content: "❌ Model ID is too long. Please use a valid model ID from OpenRouter.",
                        flags: ['Ephemeral']
                    });
                }

                // Check if already added
                if (userSettings.customModels.some(m => m.id === modelId)) {
                    return interaction.reply({
                        content: `❌ Model \`${modelId}\` is already in your custom models list. Use \`/ai list-custom-models\` to see all your models.`,
                        flags: ['Ephemeral']
                    });
                }

                // Add the model
                userSettings.customModels.push({
                    id: modelId,
                    name: displayName,
                    provider: "Custom"
                });

                // Keep max 20 custom models
                if (userSettings.customModels.length > 20) {
                    userSettings.customModels = userSettings.customModels.slice(-20);
                }

                await userSettings.save();

                // Auto-select this model if it's the first one
                if (userSettings.customModels.length === 1) {
                    userSettings.preferences.model = modelId;
                    await userSettings.save();
                    return interaction.reply({
                        content: `✅ **Custom model added and selected!**\n\n` +
                            `📦 Model: \`${modelId}\`\n` +
                            `📝 Name: ${displayName}\n\n` +
                            `This model has been automatically selected as your active model. You can switch models anytime with \`/ai model\`.`,
                        flags: ['Ephemeral']
                    });
                }

                return interaction.reply({
                    content: `✅ **Custom model added!**\n\n` +
                        `📦 Model: \`${modelId}\`\n` +
                        `📝 Name: ${displayName}\n\n` +
                        `Use \`/ai model\` to switch to this model.\n` +
                        `Use \`/ai list-custom-models\` to see all your models.`,
                    flags: ['Ephemeral']
                });
            }

            case "remove-custom-model": {
                if (!userSettings.hasCustomApi()) {
                    return interaction.reply({
                        content: "❌ You don't have a custom API key configured. Use `/ai set-api` first.",
                        flags: ['Ephemeral']
                    });
                }

                const removeModelId = interaction.options.getString("model-id").trim();

                const modelIndex = userSettings.customModels.findIndex(m => m.id === removeModelId);
                if (modelIndex === -1) {
                    return interaction.reply({
                        content: `❌ Model \`${removeModelId}\` not found in your custom models list. Use \`/ai list-custom-models\` to see your models.`,
                        flags: ['Ephemeral']
                    });
                }

                const removedModel = userSettings.customModels[modelIndex];
                userSettings.customModels.splice(modelIndex, 1);

                // If the removed model was the active one, reset to default
                if (userSettings.preferences.model === removeModelId) {
                    if (userSettings.customModels.length > 0) {
                        userSettings.preferences.model = userSettings.customModels[0].id;
                    } else {
                        userSettings.preferences.model = DEFAULT_MODEL_ID;
                    }
                }

                await userSettings.save();

                return interaction.reply({
                    content: `✅ **Custom model removed!**\n\n` +
                        `📦 Model: \`${removeModelId}\` (${removedModel.name}) has been removed.\n` +
                        (userSettings.preferences.model !== removeModelId
                            ? `Active model has been updated to: \`${userSettings.preferences.model}\``
                            : ""),
                    flags: ['Ephemeral']
                });
            }

            case "list-custom-models": {
                if (!userSettings.hasCustomApi()) {
                    return interaction.reply({
                        content: "❌ You don't have a custom API key configured. Use `/ai set-api` first, then add models with `/ai set-custom-model`.",
                        flags: ['Ephemeral']
                    });
                }

                if (userSettings.customModels.length === 0) {
                    return interaction.reply({
                        content: "📭 You haven't added any custom models yet.\n\nUse `/ai set-custom-model` to add models from OpenRouter (e.g., `openai/gpt-4o`, `anthropic/claude-3-opus`).\n\n> Browse available models: https://openrouter.ai/models",
                        flags: ['Ephemeral']
                    });
                }

                const activeModel = userSettings.preferences.model;
                const modelList = userSettings.customModels.map((m, i) => {
                    const isActive = m.id === activeModel;
                    return `${i + 1}. ${isActive ? '⭐ **' : ''}\`${m.id}\`${isActive ? '** (Active)' : ''}${m.name !== m.id ? ` — ${m.name}` : ''}`;
                }).join('\n');

                return interaction.reply({
                    embeds: [{
                        title: "📦 Your Custom Models",
                        color: colors.AI,
                        description: `You have **${userSettings.customModels.length}** custom model(s) configured.\n\n${modelList}`,
                        fields: [
                            {
                                name: "💡 Quick Tips",
                                value: "• Use `/ai model` to switch between models\n" +
                                    "• Use `/ai remove-custom-model` to remove a model\n" +
                                    "• Use `/ai set-custom-model` to add more models\n" +
                                    "• Browse all models at: https://openrouter.ai/models",
                                inline: false
                            }
                        ],
                        footer: {
                            text: "⭐ = Currently active model"
                        },
                        timestamp: new Date()
                    }],
                    flags: ['Ephemeral']
                });
            }

            case "how-to-use": {
                const hasCustomApi = userSettings.hasCustomApi();
                const customModelCount = userSettings.customModels.length;

                return interaction.reply({
                    embeds: [{
                        title: "🤖 Wolfy AI - How to Use",
                        color: colors.AI,
                        description: "Learn how to use Wolfy's AI features for free, with your own API key, or with custom models.",
                        fields: [
                            {
                                name: "📝 **Chatting with the AI**",
                                value: "There are two ways to chat:\n" +
                                    "• **Direct Messages (DM):** Send me a message directly\n" +
                                    "• **Server Chat:** Mention me (@Wolfy) or reply to my message\n" +
                                    "• **Command:** Use `/ai chat <prompt>` to chat in any channel",
                                inline: false
                            },
                            {
                                name: "⚙️ **Basic Setup**",
                                value: "• **Enable/Disable:** `/ai toggle`\n" +
                                    "• **Choose Model:** `/ai model`\n" +
                                    "• **Custom Instructions:** `/ai instructions`\n" +
                                    "• **Response Length:** `/ai length`\n" +
                                    "• **View Settings:** `/ai settings`",
                                inline: false
                            },
                            {
                                name: "🆓 **Using Wolfy AI for Free**",
                                value: "You can use Wolfy's AI for **free** without any setup! The bot uses free OpenRouter models that are completely free to use. Just enable the AI with `/ai toggle` and start chatting.\n\n" +
                                    "**Free models available:**\n" +
                                    "• `Auto (Free)` — Automatically routes to the best free model\n" +
                                    "• Various free models from NVIDIA, Cohere, and more\n\n" +
                                    "> ⚠️ Free models may have rate limits. Use `/ai stats` to check your usage.",
                                inline: false
                            },
                            {
                                name: "🔑 **Using Your Own API Key**",
                                value: "Want access to **more powerful models**? Use your own OpenRouter API key:\n\n" +
                                    "1. Sign up at https://openrouter.ai\n" +
                                    "2. Create an API key at https://openrouter.ai/keys\n" +
                                    "3. Add it with: `/ai set-api key:<your-key>`\n" +
                                    "4. Add models with: `/ai set-custom-model model-id:<model-id>`\n" +
                                    "5. Switch models with: `/ai model`\n\n" +
                                    "**Benefits of using your own API:**\n" +
                                    "• Access to **paid models** like GPT-4, Claude, Gemini, etc.\n" +
                                    "• Higher rate limits\n" +
                                    "• You control your own credits and billing\n" +
                                    "• Your API key is stored securely and only used for your requests",
                                inline: false
                            },
                            {
                                name: "🎯 **Popular Custom Models**",
                                value: "Here are some popular models you can add with your own API key:\n\n" +
                                    "• `openai/gpt-4o` — OpenAI's most capable model\n" +
                                    "• `openai/gpt-4o-mini` — Fast & affordable OpenAI model\n" +
                                    "• `anthropic/claude-3.5-sonnet` — Anthropic's balanced model\n" +
                                    "• `anthropic/claude-3-haiku` — Fast Claude model\n" +
                                    "• `google/gemini-2.0-flash-001` — Google's fast model\n" +
                                    "• `meta-llama/llama-3.3-70b-instruct` — Open-source Llama\n" +
                                    "• `microsoft/wizardlm-2-8x22b` — Microsoft's powerful model\n\n" +
                                    "> Browse all models: https://openrouter.ai/models",
                                inline: false
                            },
                            {
                                name: "📋 **Summary of Commands**",
                                value: "`/ai how-to-use` — This guide\n" +
                                    "`/ai chat` — Chat with AI in a channel\n" +
                                    "`/ai settings` — View your settings\n" +
                                    "`/ai stats` — View usage statistics\n" +
                                    "`/ai model` — Change model\n" +
                                    "`/ai toggle` — Enable/disable AI\n" +
                                    "`/ai instructions` — Set custom instructions\n" +
                                    "`/ai set-api` — Set custom API key\n" +
                                    "`/ai remove-api` — Remove custom API key\n" +
                                    "`/ai set-custom-model` — Add custom model\n" +
                                    "`/ai remove-custom-model` — Remove custom model\n" +
                                    "`/ai list-custom-models` — List custom models\n" +
                                    "`/ai clear-history` — Clear chat history\n" +
                                    "`/ai clear-instructions` — Clear instructions",
                                inline: false
                            }
                        ],
                        footer: {
                            text: hasCustomApi
                                ? `✅ You have a custom API configured with ${customModelCount} model(s)`
                                : "💡 Tip: Set up your own API key for more models!"
                        },
                        timestamp: new Date()
                    }],
                    flags: ['Ephemeral']
                });
            }

            default:
                return interaction.reply({
                    content: "❌ Unknown subcommand.",
                    flags: ['Ephemeral']
                });
        }
    }
};