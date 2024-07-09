const { Client } = require('discord.js')
const fs = require('fs');
const consoleUtil = require("../util/console");

/**
 * @param {Client} client
 */
module.exports = async (client) => {
    consoleUtil.warn("Loading events...", "Events:");
    try {
        const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

        for (const file of eventFiles) {
            const event = require(`../events/${file}`);
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