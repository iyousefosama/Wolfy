const assert = require('assert');
const {
  DEFAULT_MODEL_ID,
  FREE_MODELS,
  getModelDisplayName,
  normalizeModelId,
  isValidModel,
  getSlashCommandChoices
} = require('../util/functions/aiModels');

assert.strictEqual(DEFAULT_MODEL_ID, 'openrouter/free');
assert.strictEqual(normalizeModelId('auto'), DEFAULT_MODEL_ID);
assert.strictEqual(normalizeModelId('openrouter/auto'), DEFAULT_MODEL_ID);
assert.strictEqual(getModelDisplayName('auto'), 'Auto (Free)');
assert.strictEqual(getModelDisplayName(FREE_MODELS[0].id), FREE_MODELS[0].name);
assert.strictEqual(isValidModel(DEFAULT_MODEL_ID), true);
assert.strictEqual(isValidModel('not-a-real-model'), false);
assert.ok(getSlashCommandChoices().some(choice => choice.value === DEFAULT_MODEL_ID));
console.log('AI model centralization tests passed');
