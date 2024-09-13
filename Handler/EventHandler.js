const fs = require('fs');
const path = require('path');
const { info, success, error } = require('../util/console');

/**
 * Recursively loads all JavaScript files in a given directory and its subdirectories.
 * 
 * @param {string} dir - The directory path to search for files.
 * @returns {string[]} - Array of paths to JavaScript files.
 */
const getEventFiles = (dir) => {
    let files = [];
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
        const fullPath = path.join(dir, item.name);
        if (item.isDirectory()) {
            // Recursively load files from subdirectories
            files = files.concat(getEventFiles(fullPath));
        } else if (item.isFile() && item.name.endsWith('.js')) {
            // Add the file if it's a JavaScript file
            files.push(fullPath);
        }
    }

    return files;
};

/**
 * Load event files and register them to the client.
 * 
 * @param {import("../struct/Client")} client - The Discord client instance.
 * @param {string} directory - Directory containing the event files.
 */
module.exports = async (client, directory) => {
    info('Loading events...');
    try {
        const eventDir = path.join(__dirname, '..', directory);
        const eventFiles = getEventFiles(eventDir);

        let successCount = 0;
        let failureCount = 0;

        for (const file of eventFiles) {
            try {
                // Clear the cache of the event module
                delete require.cache[require.resolve(file)];

                // Dynamically import the event module
                const event = require(file);
                const eventModule = event.default || event;

                if (typeof eventModule.name !== 'string' || typeof eventModule.execute !== 'function') {
                    throw new Error(`Event module [${path.basename(file)}] is missing required properties: name or execute`);
                }

                // Register the event based on its type
                if (eventModule.once) {
                    client.once(eventModule.name, (...args) => eventModule.execute(client, ...args));
                } else if (eventModule.isRestEvent) {
                    client.rest.on(eventModule.name, (...args) => eventModule.execute(client, ...args));
                } else {
                    client.on(eventModule.name, (...args) => eventModule.execute(client, ...args));
                }

                successCount++;
                // consoleUtil.success(`${file}`, 'Loaded event:');
            } catch (error) {
                failureCount++;
                error(`Failed to load event ${path.basename(file)}: ${error.stack || error}`);
            }
        }

        success(`Successfully loaded ${successCount}/${eventFiles.length} events!`);
        if (failureCount > 0) {
            error(`Failed to load ${failureCount} events from the '${directory}' directory.`);
        }
    } catch (error) {
        error(`An error occurred while loading events: ${error.stack || error}`);
    }
};
