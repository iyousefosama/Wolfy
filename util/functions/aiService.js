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
 * Uses only free OpenRouter models
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

    async *chatStream({ messages, model, stream = true }) {
        if (!this.isEnabled || !this.openrouter) {
            yield "AI service is not available. Please contact the bot owner.";
            return;
        }

        // Get list of models to try
        const modelsToTry = [];
        const validatedModel = this.resolveModel(model);
        if (validatedModel === DEFAULT_MODEL_ID) {
            // If using auto, first try the free router, then all individual free models
            modelsToTry.push(DEFAULT_MODEL_ID);
            modelsToTry.push(...FREE_MODELS.map(m => m.id));
        } else {
            // If using specific model, try that first then others as fallback
            modelsToTry.push(validatedModel);
            modelsToTry.push(DEFAULT_MODEL_ID);
            modelsToTry.push(...FREE_MODELS.map(m => m.id).filter(id => id !== validatedModel));
        }

        let lastError = null;
        for (const tryModel of modelsToTry) {
            try {
                // Try different parameter formats for @openrouter/sdk compatibility
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

                        // Check for and filter out safety lines
                        // First, check if we have a complete line to check
                        while (buffer.includes('\n')) {
                            const newlineIndex = buffer.indexOf('\n');
                            const line = buffer.slice(0, newlineIndex + 1);
                            buffer = buffer.slice(newlineIndex + 1);

                            // Skip safety-related lines
                            if (!line.trim().toLowerCase().includes('safety')) {
                                yield line;
                            }
                        }
                    }
                }

                // Yield any remaining content in buffer (checking for safety)
                if (buffer && !buffer.trim().toLowerCase().includes('safety')) {
                    yield buffer;
                }

                // If we got here, the model worked - no need to try others
                return;

            } catch (error) {
                console.error(`[AI Service] Chat error with model ${tryModel}:`, error);
                lastError = error;
                // Continue to try next model
            }
        }

        // If all models failed
        console.error("[AI Service] All models failed");
        yield "Sorry, I encountered an error while processing your request.";
    }

    async chatComplete({ messages, model }) {
        if (!this.isEnabled || !this.openrouter) {
            return "AI service is not available. Please contact the bot owner.";
        }

        // Get list of models to try
        const modelsToTry = [];
        const validatedModel = this.resolveModel(model);
        if (validatedModel === DEFAULT_MODEL_ID) {
            // If using auto, first try the free router, then all individual free models
            modelsToTry.push(DEFAULT_MODEL_ID);
            modelsToTry.push(...FREE_MODELS.map(m => m.id));
        } else {
            // If using specific model, try that first then others as fallback
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

                // Filter out safety lines
                content = content.split('\n').filter(line => !line.trim().toLowerCase().includes('safety')).join('\n');

                return content.trim() || "No response received.";

            } catch (error) {
                console.error(`[AI Service] ChatComplete error with model ${tryModel}:`, error);
                lastError = error;
                // Continue to try next model
            }
        }

        // If all models failed
        console.error("[AI Service] All models failed (chatComplete)");
        return "Sorry, I encountered an error while processing your request.";
    }

    isAvailable() {
        return this.isEnabled && this.openrouter !== null;
    }
}

module.exports = new AIService();
