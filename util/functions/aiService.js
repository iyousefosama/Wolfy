const { OpenRouter } = require("@openrouter/sdk");

/**
 * AI Service for Wolfy Bot
 * Provides OpenRouter AI integration with streaming support
 */

class AIService {
    constructor() {
        this.openrouter = null;
        this.defaultModel = "arcee-ai/trinity-large-preview:free";
        this.isEnabled = false;
    }

    /**
     * Initialize the AI service with API key
     * @param {string} apiKey - OpenRouter API key
     */
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
     * Get base system instructions for Wolfy AI
     * @param {import('discord.js').Client} client - Discord client
     * @returns {string} System instructions
     */
    getBaseInstructions(client) {
        return `You are Wolfy, an AI assistant integrated into a Discord bot called "Wolfy" and made by "WOLF". 

Your personality:
- Be friendly, conversational, and engaging - like chatting with a helpful friend
- Use casual, natural language - avoid sounding like a robot or documentation
- Show enthusiasm and warmth in your responses
- Ask follow-up questions when appropriate to keep the conversation going
- Use emojis occasionally to express emotion (but don't overdo it)

Your identity:
- You are Wolfy, a helpful and friendly AI assistant for the Wolfy Discord bot
- You were created to help users with various tasks, answer questions, and chat casually
- You should be helpful, respectful, and engaging in your responses

What you can help with:
- Chatting casually about any topic
- Answering questions about the bot's features
- Explaining how to use commands when asked
- Providing information and assistance
- Having fun conversations

When users ask about features:
- Don't just list commands - explain them naturally in conversation
- Example: Instead of "Commands: remind, economy, level", say "I can help you set reminders, check your economy stats, or see your level progress!"

When responding:
- Be conversational and natural, not robotic
- Keep responses concise but friendly (Discord has message limits)
- Use Discord markdown formatting when appropriate
- If you don't know something, say so honestly and offer to help with something else
- Never claim to be a human or other AI model like GPT - you are Wolfy
- Follow Discord's Terms of Service and Community Guidelines
- Do not provide instructions for harmful activities, NSFW content, or harassment

Remember: You're having a chat with a friend, not reading from a manual!

IMPORTANT - About setting reminders:
- When a user asks you to set a reminder (e.g., "remind me to water plants in 5 minutes"), you DO NOT need to tell them how to use commands
- Simply acknowledge that you've set the reminder for them and confirm what they'll be reminded about
- For example: "Sure thing! I'll remind you to water the plants in 5 minutes 🌱"
- The reminder system will handle the actual scheduling automatically
- Never say things like "use !remind command" or give command syntax - that feels robotic`;
    }

    /**
     * Build complete system prompt with custom instructions
     * @param {import('discord.js').Client} client - Discord client
     * @param {string} customInstructions - Optional custom user instructions
     * @returns {string} Complete system prompt
     */
    buildSystemPrompt(client, customInstructions = "") {
        let prompt = this.getBaseInstructions(client);
        
        if (customInstructions && customInstructions.trim()) {
            prompt += `\n\nUser's Custom Instructions:\n${customInstructions}`;
        }
        
        return prompt;
    }

    /**
     * Validate custom instructions for Discord TOS compliance
     * @param {string} instructions - Custom instructions to validate
     * @returns {{valid: boolean, reason?: string}} Validation result
     */
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
     * Send a chat message to AI and get streaming response
     * @param {Object} options - Chat options
     * @param {Array<{role: string, content: string}>} options.messages - Message history
     * @param {string} [options.model] - Model to use
     * @param {boolean} [options.stream=true] - Whether to stream response
     * @returns {AsyncGenerator<string>} Stream of response chunks
     */
    async *chatStream({ messages, model, stream = true }) {
        if (!this.isEnabled || !this.openrouter) {
            yield "AI service is not available. Please contact the bot owner.";
            return;
        }

        try {
            const response = await this.openrouter.chat.send({
                chatGenerationParams: {
                    model: model || this.defaultModel,
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

    /**
     * Send a chat message and get complete response
     * @param {Object} options - Chat options
     * @param {Array<{role: string, content: string}>} options.messages - Message history
     * @param {string} [options.model] - Model to use
     * @returns {Promise<string>} Complete response
     */
    async chatComplete({ messages, model }) {
        if (!this.isEnabled || !this.openrouter) {
            return "AI service is not available. Please contact the bot owner.";
        }

        try {
            const response = await this.openrouter.chat.send({
                chatGenerationParams: {
                    model: model || this.defaultModel,
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

    /**
     * Check if AI service is enabled
     * @returns {boolean}
     */
    isAvailable() {
        return this.isEnabled && this.openrouter !== null;
    }
}

// Export singleton instance
module.exports = new AIService();
