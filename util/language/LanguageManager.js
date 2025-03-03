const fs = require('fs');
const path = require('path');
const Guild = require('../../schema/language');

class LanguageManager {
    constructor() {
        // Singleton pattern: Ensure only one instance is created
        if (LanguageManager.instance) {
            return LanguageManager.instance;
        }

        this.languages = new Map();
        this.languageCache = new Map(); // Guild ID -> Language Code
        this.loadLanguages();

        // Save the instance
        LanguageManager.instance = this;
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

    async loadGuildLanguages() {
        try {
            const guilds = await Guild.find();

            guilds.forEach(guild => {
                this.languageCache.set(guild.guildId, guild.language);
            });
        } catch (error) {
            console.error('Error loading guild languages:', error);
        }
    }

    getLanguage(guildId) {
        return this.languageCache.get(guildId) || 'en'; // Default to English if not set
    }

    getString(guildId, key, placeholders = {}) {
        const langCode = this.getLanguage(guildId);
        const langData = this.languages.get(langCode);
    
        if (!langData || !langData[key]) {
            throw new Error(`Language key "${key}" not found for language "${langCode}"`);
        }
    
        let string = langData[key];
    
        // Check if the language file has a special mapping for placeholders
        if (langData.PLACEHOLDER_MAPS) {
            for (const [placeholder, value] of Object.entries(placeholders)) {
                // Check if the placeholder exists inside PLACEHOLDER_MAPS
                if (langData.PLACEHOLDER_MAPS[placeholder]?.[value]) {
                    string = string.replace(new RegExp(`%${placeholder}%`, 'g'), langData.PLACEHOLDER_MAPS[placeholder][value]);
                } else {
                    string = string.replace(new RegExp(`%${placeholder}%`, 'g'), value);
                }
            }
        } else {
            // Normal replacement if PLACEHOLDER_MAPS is not defined
            for (const [placeholder, value] of Object.entries(placeholders)) {
                string = string.replace(new RegExp(`%${placeholder}%`, 'g'), value);
            }
        }
    
        return string;
    }
    
}

// Create a single instance of LanguageManager
const languageManager = new LanguageManager();

// Freeze the instance to prevent modifications
Object.freeze(languageManager);

module.exports = languageManager;