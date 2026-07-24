function buildChatMessages({ systemPrompt, history = [], userMessage, responseLength }) {
    const messages = [
        { role: 'system', content: systemPrompt },
        ...history,
        { role: 'user', content: userMessage }
    ];

    if (responseLength === 'short') {
        messages[0].content += '\n\nKeep your responses concise and brief (under 500 characters if possible).';
    } else if (responseLength === 'long') {
        messages[0].content += '\n\nProvide detailed and comprehensive responses.';
    }

    return messages;
}

function splitTextIntoChunks(text) {
    const MAX_LENGTH = 1900;
    const chunks = [];
    let currentChunk = '';
    let inCodeBlock = false;
    let codeBlockLanguage = '';

    const lines = text.split('\n');

    for (const line of lines) {
        const isCodeBlockLine = line.trim().startsWith('```');
        const tempChunk = currentChunk ? `${currentChunk}\n${line}` : line;

        if (isCodeBlockLine) {
            if (inCodeBlock) {
                // Ending a code block
                currentChunk = tempChunk;
                inCodeBlock = false;
                codeBlockLanguage = '';
            } else {
                // Starting a code block
                if (currentChunk && tempChunk.length > MAX_LENGTH) {
                    // Current chunk is full, add it and start new one
                    chunks.push(currentChunk);
                    currentChunk = line;
                } else {
                    currentChunk = tempChunk;
                }
                inCodeBlock = true;
                // Extract language if specified
                codeBlockLanguage = line.trim().slice(3);
            }
        } else {
            if (inCodeBlock) {
                // Inside code block: always add the line, but check if need to split first
                if (currentChunk && currentChunk.length + line.length + 1 > MAX_LENGTH) {
                    // Close current code block, add chunk, start new with open code block
                    chunks.push(`${currentChunk}\n\`\`\``);
                    currentChunk = `\`\`\`${codeBlockLanguage}\n${line}`;
                } else {
                    currentChunk = tempChunk;
                }
            } else {
                // Outside code block: normal splitting
                if (tempChunk.length > MAX_LENGTH) {
                    if (currentChunk) {
                        chunks.push(currentChunk);
                    }
                    // Try to split long line into smaller parts
                    let remaining = line;
                    while (remaining.length > 0) {
                        const part = remaining.slice(0, MAX_LENGTH);
                        chunks.push(part);
                        remaining = remaining.slice(MAX_LENGTH);
                    }
                    currentChunk = '';
                } else {
                    currentChunk = tempChunk;
                }
            }
        }
    }

    // Add last chunk
    if (currentChunk) {
        chunks.push(currentChunk);
    }

    return chunks;
}

async function sendAiResponse({
    client,
    message,
    userSettings,
    userMessage,
    replyToMessage = message,
    aiServiceInstance = require('./aiService')
}) {
    const systemPrompt = aiServiceInstance.buildSystemPrompt(client, userSettings.customInstructions);
    const messages = buildChatMessages({
        systemPrompt,
        history: userSettings.getFormattedHistory ? userSettings.getFormattedHistory() : [],
        userMessage,
        responseLength: userSettings.preferences?.responseLength
    });

    let fullResponse = '';
    let completeResponse = '';
    let messageSent = false;
    let lastMessage = null;

    for await (const chunk of aiServiceInstance.chatStream({
        messages,
        model: userSettings.preferences?.model || aiServiceInstance.defaultModel
    })) {
        fullResponse += chunk;
        completeResponse += chunk;

        // Only split when we have a reasonable amount of text
        if (fullResponse.length > 2000) {
            const chunks = splitTextIntoChunks(fullResponse);
            // Send all chunks except the last one
            for (let i = 0; i < chunks.length - 1; i++) {
                const content = chunks[i];
                if (!messageSent) {
                    lastMessage = await replyToMessage.reply({ content }).catch(() => null);
                    messageSent = true;
                } else if (lastMessage) {
                    lastMessage = await replyToMessage.reply({ content }).catch(() => null);
                }
            }
            // Keep the last chunk as new fullResponse
            fullResponse = chunks[chunks.length - 1] || '';
        }
    }

    // Send remaining text
    if (fullResponse.trim()) {
        const chunks = splitTextIntoChunks(fullResponse);
        for (const content of chunks) {
            if (!messageSent) {
                lastMessage = await replyToMessage.reply({ content }).catch(() => null);
                messageSent = true;
            } else if (lastMessage) {
                lastMessage = await replyToMessage.reply({ content }).catch(() => null);
            }
        }
    } else if (!messageSent) {
        await replyToMessage.reply({ content: "I'm not sure how to respond to that. Could you rephrase your question?" }).catch(() => {});
    }

    return completeResponse || fullResponse || "I'm not sure how to respond to that. Could you rephrase your question?";
}

module.exports = {
    buildChatMessages,
    splitTextIntoChunks,
    sendAiResponse
};
