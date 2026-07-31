const { OpenRouter } = require("@openrouter/sdk");
const {
    DEFAULT_MODEL_ID,
    FREE_MODELS,
    getAvailableModels,
    normalizeModelId
} = require("./aiModels");

/**
 * AI Service for Wolfy Bot
 * Provides OpenRouter AI integration with streaming support
 * Supports both free OpenRouter models and custom API keys/models
 */

class AIService {
    constructor() {
        this.openrouter = null;
        this.defaultModel = DEFAULT_MODEL_ID;
        this.isEnabled = false;
        this.availableModels = getAvailableModels();
    }

    getAvailableModels() {
        return this.availableModels;
    }

    getModelDisplayName(modelId) {
        const { getModelDisplayName } = require("./aiModels");
        return getModelDisplayName(modelId);
    }

    resolveModel(modelId) {
        const normalizedModelId = normalizeModelId(modelId);
        if (!normalizedModelId || normalizedModelId === DEFAULT_MODEL_ID) {
            return this.defaultModel;
        }

        return this.isValidModel(normalizedModelId) ? normalizedModelId : this.defaultModel;
    }

    isValidModel(modelId) {
        const { isValidModel } = require("./aiModels");
        return isValidModel(modelId);
    }

    initialize(apiKey) {
        if (!apiKey) {
            console.log("[AI Service] No API key provided, AI features disabled");
            this.isEnabled = false;
            return;
        }
        try {
            this.openrouter = new OpenRouter({ apiKey });
            this.isEnabled = true;
            console.log("[AI Service] Initialized successfully");
        } catch (error) {
            console.error("[AI Service] Failed to initialize:", error);
            this.isEnabled = false;
        }
    }

    /**
     * Create a custom OpenRouter client for a user's personal API key
     * @param {string} apiKey - User's custom API key
     * @param {string} [baseUrl] - Optional custom base URL
     * @returns {Object} OpenRouter client instance
     */
    createCustomClient(apiKey, baseUrl) {
        try {
            const config = { apiKey };
            if (baseUrl && baseUrl.trim()) {
                config.baseURL = baseUrl.trim();
            }
            return new OpenRouter(config);
        } catch (error) {
            console.error("[AI Service] Failed to create custom client:", error);
            return null;
        }
    }

    /**
     * Check if a model is a custom model (not in the free list)
     * @param {string} modelId - Model ID to check
     * @param {Array} customModels - Array of custom model objects
     * @returns {boolean}
     */
    isCustomModel(modelId, customModels = []) {
        return customModels.some(m => m.id === modelId);
    }

    getBaseInstructions(client) {
        return `You are Wolfy, a highly intelligent AI assistant integrated into a Discord bot.

Core Intelligence & Behavior:
- Think critically and provide thoughtful, well-reasoned responses
- Be conversational and engaging - adapt your tone to match the user's energy
- Use natural language with nuance and sophistication
- Be proactive in offering helpful suggestions and follow-up questions
- Demonstrate understanding of context and remember conversation flow
- Use creative problem-solving approaches when appropriate

Communication Style:
- Be warm and authentic, not robotic or overly formal
- Use appropriate emojis to convey emotion and emphasis (1-3 per message)
- Vary sentence structure and vocabulary for engaging conversation
- Ask clarifying questions when user requests are ambiguous
- Provide examples and analogies when explaining complex concepts

Knowledge & Capabilities:
- Understand Discord features and can help with bot commands
- Provide detailed explanations on a wide range of topics
- Help with creative writing, brainstorming, and problem-solving
- Offer practical advice and actionable suggestions
- Recognize when to be concise vs when to be detailed

Guidelines:
- Prioritize helpfulness and accuracy in all responses
- Use Discord markdown formatting for readability (bold, italics, code blocks)
- Keep responses appropriately sized for Discord (under 1500 chars when possible)
- Admit uncertainty and offer to research when unsure
- Never claim to be human or other AI models - you are Wolfy
- Follow Discord's Terms of Service and promote positive interactions`;
    }

    buildSystemPrompt(client, customInstructions = "") {
        let prompt = this.getBaseInstructions(client);
        if (customInstructions && customInstructions.trim()) {
            prompt += `\n\nUser's Custom Instructions:\n${customInstructions}`;
        }
        return prompt;
    }

    validateInstructions(instructions) {
        if (!instructions || instructions.trim().length === 0) {
            return { valid: false, reason: "Instructions cannot be empty" };
        }
        if (instructions.length > 2000) {
            return { valid: false, reason: "Instructions must be under 2000 characters" };
        }
        const forbiddenPatterns = [
            /ignore\s+previous\s+instructions/gi,
            /disregard\s+(?:all\s+)?(?:prior|previous|system)\s+(?:instructions|prompts)/gi,
            /you\s+are\s+(?:now\s+)?(?:an?\s+)?(?:hacker|criminal|terrorist)/gi,
            /generate\s+(?:child\s+)?(?:sexual|abuse|exploitation|porn)/gi,
            /create\s+(?:malware|virus|trojan|ransomware)/gi,
            /how\s+to\s+(?:hack|ddos|swat|dox|harass)/gi,
            /promote\s+(?:violence|hate\s+speech|discrimination)/gi,
            /discord\s+token\s+(?:stealer|logger|grabber)/gi,
            /raid\s+(?:server|discord)/gi,
            /mass\s+(?:dm|mention|ping)/gi,
        ];
        for (const pattern of forbiddenPatterns) {
            if (pattern.test(instructions)) {
                return { valid: false, reason: "Instructions contain potentially harmful or policy-violating content" };
            }
        }
        return { valid: true };
    }

    /**
     * Send a chat request using either the bot's global API or a user's custom API
     * @param {Object} options
     * @param {Array} options.messages - Chat messages
     * @param {string} options.model - Model ID to use
     * @param {boolean} [options.stream=true] - Whether to stream the response
     * @param {Object} [options.userSettings] - User settings for custom API
     * @returns {AsyncGenerator} Stream of response chunks
     */
    async *chatStream({ messages, model, stream = true, userSettings = null }) {
        // Determine if we should use custom API
        const useCustomApi = userSettings && userSettings.hasCustomApi && userSettings.hasCustomApi();
        const customModels = userSettings?.customModels || [];

        if (useCustomApi) {
            // Use user's custom API
            const customClient = this.createCustomClient(
                userSettings.customApiKey,
                userSettings.customApiUrl
            );

            if (!customClient) {
                yield "❌ Failed to initialize your custom API connection. Please check your API key and try again.";
                return;
            }

            // Determine which model to use with custom API
            let modelToUse = model || this.defaultModel;
            
            // If model is auto/free, use the first custom model or fall back to a default
            if (modelToUse === DEFAULT_MODEL_ID || modelToUse === 'auto' || modelToUse === 'openrouter/auto') {
                if (customModels.length > 0) {
                    modelToUse = customModels[0].id;
                } else {
                    // No custom models defined, use a sensible default
                    modelToUse = 'openrouter/auto';
                }
            }

            try {
                let response;
                try {
                    response = await customClient.chat.send({
                        model: modelToUse,
                        messages,
                        stream
                    });
                } catch (err1) {
                    try {
                        response = await customClient.chat.send({
                            chatGenerationParams: {
                                model: modelToUse,
                                messages,
                                stream
                            }
                        });
                    } catch (err2) {
                        response = await customClient.chat.send({
                            chatRequest: {
                                model: modelToUse,
                                messages,
                                stream
                            }
                        });
                    }
                }

                let buffer = '';
                for await (const chunk of response) {
                    const content = chunk.choices[0]?.delta?.content;
                    if (content) {
                        buffer += content;

                        while (buffer.includes('\n')) {
                            const newlineIndex = buffer.indexOf('\n');
                            const line = buffer.slice(0, newlineIndex + 1);
                            buffer = buffer.slice(newlineIndex + 1);

                            if (!line.trim().toLowerCase().includes('safety')) {
                                yield line;
                            }
                        }
                    }
                }

                if (buffer && !buffer.trim().toLowerCase().includes('safety')) {
                    yield buffer;
                }

                return;
            } catch (error) {
                console.error(`[AI Service] Custom API chat error with model ${modelToUse}:`, error);
                yield `❌ Error with your custom API: ${error.message || 'Unknown error'}. Please check your API key and model configuration.`;
                return;
            }
        }

        // Use bot's global API (existing logic)
        if (!this.isEnabled || !this.openrouter) {
            yield "AI service is not available. Please contact the bot owner.";
            return;
        }

        // Get list of models to try
        const modelsToTry = [];
        const validatedModel = this.resolveModel(model);
        if (validatedModel === DEFAULT_MODEL_ID) {
            modelsToTry.push(DEFAULT_MODEL_ID);
            modelsToTry.push(...FREE_MODELS.map(m => m.id));
        } else {
            modelsToTry.push(validatedModel);
            modelsToTry.push(DEFAULT_MODEL_ID);
            modelsToTry.push(...FREE_MODELS.map(m => m.id).filter(id => id !== validatedModel));
        }

        let lastError = null;
        for (const tryModel of modelsToTry) {
            try {
                let response;
                try {
                    response = await this.openrouter.chat.send({
                        model: tryModel,
                        messages,
                        stream
                    });
                } catch (err1) {
                    try {
                        response = await this.openrouter.chat.send({
                            chatGenerationParams: {
                                model: tryModel,
                                messages,
                                stream
                            }
                        });
                    } catch (err2) {
                        response = await this.openrouter.chat.send({
                            chatRequest: {
                                model: tryModel,
                                messages,
                                stream
                            }
                        });
                    }
                }

                let buffer = '';
                for await (const chunk of response) {
                    const content = chunk.choices[0]?.delta?.content;
                    if (content) {
                        buffer += content;

                        while (buffer.includes('\n')) {
                            const newlineIndex = buffer.indexOf('\n');
                            const line = buffer.slice(0, newlineIndex + 1);
                            buffer = buffer.slice(newlineIndex + 1);

                            if (!line.trim().toLowerCase().includes('safety')) {
                                yield line;
                            }
                        }
                    }
                }

                if (buffer && !buffer.trim().toLowerCase().includes('safety')) {
                    yield buffer;
                }

                return;
            } catch (error) {
                console.error(`[AI Service] Chat error with model ${tryModel}:`, error);
                lastError = error;
            }
        }

        console.error("[AI Service] All models failed");
        yield "Sorry, I encountered an error while processing your request.";
    }

    async chatComplete({ messages, model, userSettings = null }) {
        // Determine if we should use custom API
        const useCustomApi = userSettings && userSettings.hasCustomApi && userSettings.hasCustomApi();
        const customModels = userSettings?.customModels || [];

        if (useCustomApi) {
            const customClient = this.createCustomClient(
                userSettings.customApiKey,
                userSettings.customApiUrl
            );

            if (!customClient) {
                return "❌ Failed to initialize your custom API connection. Please check your API key and try again.";
            }

            let modelToUse = model || this.defaultModel;
            
            if (modelToUse === DEFAULT_MODEL_ID || modelToUse === 'auto' || modelToUse === 'openrouter/auto') {
                if (customModels.length > 0) {
                    modelToUse = customModels[0].id;
                } else {
                    modelToUse = 'openrouter/auto';
                }
            }

            try {
                let response;
                try {
                    response = await customClient.chat.send({
                        model: modelToUse,
                        messages,
                        stream: false
                    });
                } catch (err1) {
                    try {
                        response = await customClient.chat.send({
                            chatGenerationParams: {
                                model: modelToUse,
                                messages,
                                stream: false
                            }
                        });
                    } catch (err2) {
                        response = await customClient.chat.send({
                            chatRequest: {
                                model: modelToUse,
                                messages,
                                stream: false
                            }
                        });
                    }
                }

                let content = response.choices[0]?.message?.content || "No response received.";
                content = content.split('\n').filter(line => !line.trim().toLowerCase().includes('safety')).join('\n');
                return content.trim() || "No response received.";
            } catch (error) {
                console.error(`[AI Service] Custom API chatComplete error:`, error);
                return `❌ Error with your custom API: ${error.message || 'Unknown error'}.`;
            }
        }

        // Use bot's global API
        if (!this.isEnabled || !this.openrouter) {
            return "AI service is not available. Please contact the bot owner.";
        }

        const modelsToTry = [];
        const validatedModel = this.resolveModel(model);
        if (validatedModel === DEFAULT_MODEL_ID) {
            modelsToTry.push(DEFAULT_MODEL_ID);
            modelsToTry.push(...FREE_MODELS.map(m => m.id));
        } else {
            modelsToTry.push(validatedModel);
            modelsToTry.push(DEFAULT_MODEL_ID);
            modelsToTry.push(...FREE_MODELS.map(m => m.id).filter(id => id !== validatedModel));
        }

        let lastError = null;
        for (const tryModel of modelsToTry) {
            try {
                let response;
                try {
                    response = await this.openrouter.chat.send({
                        model: tryModel,
                        messages,
                        stream: false
                    });
                } catch (err1) {
                    try {
                        response = await this.openrouter.chat.send({
                            chatGenerationParams: {
                                model: tryModel,
                                messages,
                                stream: false
                            }
                        });
                    } catch (err2) {
                        response = await this.openrouter.chat.send({
                            chatRequest: {
                                model: tryModel,
                                messages,
                                stream: false
                            }
                        });
                    }
                }

                let content = response.choices[0]?.message?.content || "No response received.";
                content = content.split('\n').filter(line => !line.trim().toLowerCase().includes('safety')).join('\n');
                return content.trim() || "No response received.";
            } catch (error) {
                console.error(`[AI Service] ChatComplete error with model ${tryModel}:`, error);
                lastError = error;
            }
        }

        console.error("[AI Service] All models failed (chatComplete)");
        return "Sorry, I encountered an error while processing your request.";
    }

    isAvailable() {
        return this.isEnabled && this.openrouter !== null;
    }
}

module.exports = new AIService();