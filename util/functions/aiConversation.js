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

        if (fullResponse.length > 1800) {
            const contentToSend = fullResponse.substring(0, 1990);
            if (!messageSent) {
                lastMessage = await replyToMessage.reply({ content: contentToSend + (fullResponse.length > 1990 ? '...' : '') }).catch(() => null);
                messageSent = true;
            } else if (lastMessage) {
                lastMessage = await replyToMessage.reply({ content: contentToSend + (fullResponse.length > 1990 ? '...' : '') }).catch(() => null);
            }

            fullResponse = '';
        }
    }

    if (fullResponse.trim()) {
        const finalResponse = fullResponse.length > 1990 ? fullResponse.substring(0, 1987) + '...' : fullResponse;
        await replyToMessage.reply({ content: finalResponse }).catch(() => {});
    } else if (!messageSent) {
        await replyToMessage.reply({ content: "I'm not sure how to respond to that. Could you rephrase your question?" }).catch(() => {});
    }

    return completeResponse || fullResponse || "I'm not sure how to respond to that. Could you rephrase your question?";
}

module.exports = {
    buildChatMessages,
    sendAiResponse
};
