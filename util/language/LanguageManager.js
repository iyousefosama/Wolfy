const fs = require('fs');
const path = require('path');
const Guild = require('../../schema/language');

class LanguageManager {
    constructor() {
        this.languages = new Map();
        this.loadLanguages();
    }

    loadLanguages() {
        const langDir = path.join(__dirname);
        const files = fs.readdirSync(langDir);

        for (const file of files) {
            if (file.endsWith('.js')) {
                const langCode = file.split('.')[0];
                const langData = require(path.join(langDir, file));
                this.languages.set(langCode, langData);
            }
        }
    }

    async getLanguage(guildId) {
        const guild = await Guild.findOne({ guildId });
        return guild ? guild.language : 'en'; // Default to English if not set
    }

    async getString(guildId, key, placeholders = {}) {
        const langCode = await this.getLanguage(guildId);
        const langData = this.languages.get(langCode);

        if (!langData || !langData[key]) {
            throw new Error(`Language key "${key}" not found for language "${langCode}"`);
        }

        let string = langData[key];

        // Replace placeholders in the string
        for (const [placeholder, value] of Object.entries(placeholders)) {
            string = string.replace(new RegExp(`%${placeholder}%`, 'g'), value);
        }

        return string;
    }
}

module.exports = LanguageManager;