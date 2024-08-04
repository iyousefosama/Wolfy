const fs = require('fs');
const path = require('path');
const consoleUtil = require('../util/console');

/**
 * Load event files and register them to the client.
 * 
 * @param {import("../struct/Client")} client - The Discord client instance.
 * @param {string} directory - Directory containing the event files.
 */
module.exports = async (client, directory) => {
    consoleUtil.warn('Loading events...', 'Events:');
    try {
        const eventDir = path.join(__dirname, '..', directory);
        const eventFiles = fs.readdirSync(eventDir).filter(file => file.endsWith('.js'));

        let successCount = 0;
        let failureCount = 0;

        for (const file of eventFiles) {
            try {
                const eventPath = path.join(eventDir, file);
                const eventUrl = `file://${eventPath.replace(/\\/g, '/')}`; // Convert to file URL
                const event = await import(eventUrl);
                const eventModule = event.default || event;

                if (typeof eventModule.name !== 'string' || typeof eventModule.execute !== 'function') {
                    throw new Error(`Event module [${file}] is missing required properties: name or execute`);
                }

                if (eventModule.once) {
                    client.once(eventModule.name, (...args) => eventModule.execute(client, ...args));
                } else if (eventModule.isRestEvent) {
                    client.rest.on(eventModule.name, (...args) => eventModule.execute(client, ...args));
                } else {
                    client.on(eventModule.name, (...args) => eventModule.execute(client, ...args));
                }

                successCount++;
                //consoleUtil.Success(`${file}`, 'Loaded event:');
            } catch (error) {
                failureCount++;
                consoleUtil.error(`Failed to load event ${file}: ${error.stack || error}`);
            }
        }

        consoleUtil.Success(`Successfully loaded ${successCount}/${eventFiles.length} events!`);
        if (failureCount > 0) {
            consoleUtil.error(`Failed to load ${failureCount} events from the '${directory}' directory.`);
        }
    } catch (error) {
        consoleUtil.error(`An error occurred while loading events: ${error.stack || error}`);
    }
};
