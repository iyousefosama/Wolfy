const FREE_MODELS = [
    { id: 'nvidia/nemotron-3-ultra-550b-a55b:free', name: 'Nemotron 3 ultra', provider: 'NVIDIA' },
    { id: 'nvidia/nemotron-3-super-120b-a12b:free', name: 'Nemotron 3 super', provider: 'NVIDIA' },
    { id: 'cohere/north-mini-code:free', name: 'North mini code', provider: 'Cohere' },
];

const DEFAULT_MODEL_ID = 'openrouter/free';

function normalizeModelId(modelId) {
    if (!modelId) {
        return null;
    }

    const normalized = String(modelId).trim();
    if (normalized === 'auto' || normalized === 'openrouter/auto' || normalized === 'openrouter/free') {
        return DEFAULT_MODEL_ID;
    }

    return normalized;
}

function getAvailableModels() {
    return [
        { id: DEFAULT_MODEL_ID, name: 'Auto (Free)', provider: 'openrouter/free' },
        ...FREE_MODELS
    ];
}

function getModelDisplayName(modelId) {
    const normalizedModelId = normalizeModelId(modelId);
    if (!normalizedModelId || normalizedModelId === DEFAULT_MODEL_ID) {
        return 'Auto (Free)';
    }

    return getAvailableModels().find(model => model.id === normalizedModelId)?.name || 'Auto (Free)';
}

function isValidModel(modelId) {
    const normalizedModelId = normalizeModelId(modelId);
    return getAvailableModels().some(model => model.id === normalizedModelId);
}

function getSlashCommandChoices() {
    return [
        { name: 'Auto (Free)', value: DEFAULT_MODEL_ID },
        ...FREE_MODELS.map(model => ({
            name: `${model.name} (Free)`,
            value: model.id
        }))
    ];
}

module.exports = {
    FREE_MODELS,
    DEFAULT_MODEL_ID,
    normalizeModelId,
    getAvailableModels,
    getModelDisplayName,
    isValidModel,
    getSlashCommandChoices
};
