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

        for (const file of eventFiles) {
            const event = require(`..${directory}/${file}`);
            if (event.once) {
                client.once(event.name, (...args) => event.execute(client, ...args));
            } else if (event.isRestEvent) {
                client.rest.on(event.name, (...args) => event.execute(client, ...args));
            } else {
                client.on(event.name, (...args) => event.execute(client, ...args));
            }
        }

        consoleUtil.Success(`Loaded ${eventFiles.length} events!`)
    } catch (error) {
        consoleUtil.error(`An error occurred while loading events: ${error}`)
    }
};