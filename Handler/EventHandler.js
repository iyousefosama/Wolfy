const fs = require('fs');
const path = require('path');
const consoleUtil = require("../util/console");

/**
 * 
 * @param {import("../struct/Client")} client 
 * @param {string} directory directory containing the event files
 */
module.exports = async (client, directory) => {
    consoleUtil.warn("Loading events...", "Events:");
    try {
        const eventFiles = fs.readdirSync(path.join(__dirname, "..", directory)).filter(file => file.endsWith('.js'));
        let success = 0;
        let failed = 0;

        for (const file of eventFiles) {
            try {
                const eventPath = path.join(__dirname, "..", directory, file);
                const eventUrl = `file://${eventPath.replace(/\\/g, '/')}`; // Convert to file URL
                const event = await import(eventUrl);
                const eventModule = event.default || event;

                if (eventModule.once) {
                    client.once(eventModule.name, (...args) => eventModule.execute(client, ...args));
                } else if (eventModule.isRestEvent) {
                    client.rest.on(eventModule.name, (...args) => eventModule.execute(client, ...args));
                } else {
                    client.on(eventModule.name, (...args) => eventModule.execute(client, ...args));
                }
                success++
            } catch (error) {
                consoleUtil.error(`Failed to load event ${file}: ${error}`);
                failed++
            }
        }

        consoleUtil.Success(`Loaded ${success} events!`);
        failed > 0 ? consoleUtil.error(`Failed to load ${failed} commands from '${folder}' folder!`) : "";
    } catch (error) {
        consoleUtil.error(`An error occurred while loading events: ${error}`);
    }
};
