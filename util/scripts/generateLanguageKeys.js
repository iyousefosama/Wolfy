const fs = require('fs');
const path = require('path');

// Path to the en.js file
const enFilePath = path.join(__dirname, '../language/en.js');
// Path to the output type file
const outputFilePath = path.join(__dirname, '../types/LanguageKeys.js');

// Load the en.js file
const en = require(enFilePath);

// Extract placeholders from translation strings
const extractPlaceholders = (str) => {
    const placeholderRegex = /%([a-zA-Z0-9_]+)%/g;
    const placeholders = new Set();
    let match;
    while ((match = placeholderRegex.exec(str)) !== null) {
        placeholders.add(match[1]);
    }
    return Array.from(placeholders);
};

// Generate placeholder types
const generatePlaceholderTypes = () => {
    const placeholderTypes = {};

    for (const [key, value] of Object.entries(en)) {
        if (typeof value === 'string') {
            const placeholders = extractPlaceholders(value);
            if (placeholders.length > 0) {
                placeholderTypes[key] = placeholders.reduce((acc, placeholder) => {
                    acc[placeholder] = 'string';
                    return acc;
                }, {});
            }
        }
    }

    return placeholderTypes;
};

// Generate the type definition
const placeholderTypes = generatePlaceholderTypes();

const typeDefinition = `/**
 * @typedef {Object} LanguageKeys
${Object.keys(en)
  .filter((key) => typeof en[key] === 'string')
  .map((key) => ` * @property {string} ${key} - ${en[key].replace(/\n/g, ' ').replace(/\*/g, '')}`)
  .join('\n')}
 */

/**
 * @typedef {Object} PlaceholderTypes
${Object.entries(placeholderTypes)
  .map(([key, placeholders]) => ` * @property {{ ${Object.entries(placeholders).map(([placeholder, type]) => `${placeholder}: ${type}`).join(', ')} }} ${key}`)
  .join('\n')}
 */

module.exports = {};`;

// Write the type definition to the output file
fs.writeFileSync(outputFilePath, typeDefinition, 'utf8');

console.log('LanguageKeys and PlaceholderTypes generated successfully!');
