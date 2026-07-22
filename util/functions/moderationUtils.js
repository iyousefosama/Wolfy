const level = require('./LevelTrigger');
const wordFilter = require('./BadWordsFilter');
const linkProtection = require('./AntiLinks');
const commandsManager = require('./Manager');
const antiBot = require('./AntiBot');
const antiSpam = require('./AntiSpam');

module.exports = {
    level,
    wordFilter,
    linkProtection,
    commandsManager,
    antiBot,
    antiSpam
}