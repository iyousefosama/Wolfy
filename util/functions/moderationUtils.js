const level = require('./LevelTrigger');
const wordFilter = require('./BadWordsFilter');
const linkProtection = require('./AntiLinks');
const commandsManager = require('./Manager');

module.exports = {
    level,
    wordFilter,
    linkProtection,
    commandsManager
}