const fs = require('fs');
const path = require('path');
const Guild = require('../../schema/language');
const consoleUtil = require('../../util/console');

// Import the generated LanguageKeys type
const { LanguageKeys, PlaceholderTypes } = require('../types/LanguageKeys');

class LanguageManager {
    constructor() {
        // Singleton pattern: Ensure only one instance is created
        if (LanguageManager.instance) {
            return LanguageManager.instance;
        }

        this.languages = new Map();
        this.languageCache = new Map(); // Guild ID -> Language Code
        this.mismatchLog = []; // To store mismatch details
        this.loadLanguages();

        // Save the instance
        LanguageManager.instance = this;
    }

    loadLanguages() {
        const langDir = path.join(__dirname);
        const files = fs.readdirSync(langDir);

        // Load only language files (e.g., en.js, ar.js, etc.)
        for (const file of files) {
            if (file.endsWith('.js') && file !== 'LanguageManager.js') { // Exclude LanguageManager.js
                const langCode = file.split('.')[0];
                const langData = require(path.join(langDir, file));
                this.languages.set(langCode, langData);
            }
        }

        // Check for mismatches between languages
        this.checkLanguageMismatches();
    }

    checkLanguageMismatches() {
        const referenceLang = 'en'; // Use English as the reference language
        const referenceKeys = Object.keys(this.languages.get(referenceLang));

        for (const [langCode, langData] of this.languages) {
            if (langCode === referenceLang) continue; // Skip the reference language

            const langKeys = Object.keys(langData);

            // Check for missing keys in the current language
            const missingKeys = referenceKeys.filter(key => !langKeys.includes(key));
            if (missingKeys.length > 0) {
                this.mismatchLog.push(`Language "${langCode}" is missing the following keys: ${missingKeys.join(', ')}`);
            }

            // Check for extra keys in the current language
            const extraKeys = langKeys.filter(key => !referenceKeys.includes(key));
            if (extraKeys.length > 0) {
                this.mismatchLog.push(`Language "${langCode}" has extra keys: ${extraKeys.join(', ')}`);
            }
        }

        // Log mismatches to the console
        if (this.mismatchLog.length > 0) {
            consoleUtil.warn('Language mismatches found:');
            this.mismatchLog.forEach(log => console.warn(log));
        }

        // Write mismatches to a file
        this.writeMismatchesToFile();
    }

    writeMismatchesToFile() {
        const logFilePath = path.join(__dirname, 'language_mismatches.log');
        const logContent = this.mismatchLog.join('\n');

        fs.writeFileSync(logFilePath, logContent, 'utf8');
        if (logContent) {
            consoleUtil.error(`Language mismatches logged to ${logFilePath}`);
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

/**
 * Get a localized string for a given key.
 * @template {keyof LanguageKeys} K
 * @param {K} key - The key for the localized string.
 * @param {string | PlaceholderTypes[K] | null} guildIdOrPlaceholders - The guild ID or placeholders object.
 * @param {PlaceholderTypes[K]} placeholders - The placeholders to replace in the string.
 * @returns {string} The localized string.
 */
getString(key, guildIdOrPlaceholders = null, placeholders = {}) {
    // Determine if the second argument is guildId or placeholders
    let guildId = null;
    if (typeof guildIdOrPlaceholders === 'string') {
        // If the second argument is a string, treat it as guildId
        guildId = guildIdOrPlaceholders;
    } else if (typeof guildIdOrPlaceholders === 'object' && guildIdOrPlaceholders !== null) {
        // If the second argument is an object, treat it as placeholders
        placeholders = guildIdOrPlaceholders;
    }

    // If guildId is not provided or is invalid, default to 'en'
    const langCode = guildId && this.languageCache.has(guildId) ? this.getLanguage(guildId) : 'en';
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