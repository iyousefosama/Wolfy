const { OpenRouter } = require("@openrouter/sdk");

/**
 * AI Service for Wolfy Bot
 * Provides OpenRouter AI integration with streaming support
 * Uses only free OpenRouter models
 */

// Available free models on OpenRouter (no API cost)
const FREE_MODELS = [
    { id: "arcee-ai/trinity-large-preview:free", name: "Trinity Large Preview", provider: "Arcee AI" },
    { id: "qwen/qwen3-coder:free", name: "Qwen 3 Coder", provider: "Qwen" },
    { id: "stepfun/step-3.5-flash:free", name: "Step 3.5 Flash", provider: "Stepfun" },
    { id: "z-ai/glm-4.5-air:free", name: "GLM 4.5 Air", provider: "Z-AI" },
    { id: "meta-llama/llama-3.3-70b-instruct:free", name: "Llama 3.3 70B Instruct", provider: "Meta" },
    { id: "openai/gpt-oss-120b:free", name: "GPT-OSS 120B", provider: "OpenAI" }
];

class AIService {
    constructor() {
        this.openrouter = null;
        this.defaultModel = FREE_MODELS[0].id;
        this.isEnabled = false;
        this.availableModels = FREE_MODELS;
    }

    getAvailableModels() {
        return this.availableModels;
    }

    isValidModel(modelId) {
        return this.availableModels.some(m => m.id === modelId);
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
        const validatedModel = this.isValidModel(model) ? model : this.defaultModel;
        try {
            const response = await this.openrouter.chat.send({
                chatGenerationParams: {
                    model: validatedModel,
                    messages,
                    stream
                }
            });
            for await (const chunk of response) {
                const content = chunk.choices[0]?.delta?.content;
                if (content) {
                    yield content;
                }
            }
        } catch (error) {
            console.error("[AI Service] Chat error:", error);
            yield "Sorry, I encountered an error while processing your request.";
        }
    }

    async chatComplete({ messages, model }) {
        if (!this.isEnabled || !this.openrouter) {
            return "AI service is not available. Please contact the bot owner.";
        }
        const validatedModel = this.isValidModel(model) ? model : this.defaultModel;
        try {
            const response = await this.openrouter.chat.send({
                chatGenerationParams: {
                    model: validatedModel,
                    messages,
                    stream: false
                }
            });
            return response.choices[0]?.message?.content || "No response received.";
        } catch (error) {
            console.error("[AI Service] Chat error:", error);
            return "Sorry, I encountered an error while processing your request.";
        }
    }

    isAvailable() {
        return this.isEnabled && this.openrouter !== null;
    }
}

module.exports = new AIService();
