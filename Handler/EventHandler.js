const Discord = require('discord.js')
const { Client, Intents, Collection } = require('discord.js')
const fs = require('fs');
const config = require('../config.json');

/**
 * @param {Client} client
 */

module.exports = async (client) => {
    const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const event = require(`../events/${file}`);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(client, ...args));
        } else {
            client.on(event.name, (...args) => event.execute(client, ...args));
            }
        }
};