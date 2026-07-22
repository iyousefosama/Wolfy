const assert = require('assert');
const { buildChatMessages } = require('../util/functions/aiConversation');

const messages = buildChatMessages({
  systemPrompt: 'You are Wolfy',
  history: [{ role: 'user', content: 'Hello' }],
  userMessage: 'How are you?',
  responseLength: 'short'
});

assert.strictEqual(messages[0].role, 'system');
assert.ok(messages[0].content.includes('Keep your responses concise'));
assert.strictEqual(messages[messages.length - 1].content, 'How are you?');
console.log('AI conversation helper tests passed');
