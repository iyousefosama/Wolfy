const discord = require('discord.js')
const { Client } = require('discord.js')
const fs = require('fs');
const consoleUtil = require("../util/console");

/**
 * @param {Client} client
 */

module.exports = async (client) => {
  consoleUtil.warn("Loading message commands...")
  try {
    client.commands = new discord.Collection();

    const commandFolders = fs.readdirSync('./commands');
    for (const folder of commandFolders) {
      const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));

      for (const file of commandFiles) {
        const command = require(`../commands/${folder}/${file}`);
        client.commands.set(command.name, command);
      }

      if (commandFiles.length <= 0) {
        consoleUtil.error("Can't find any commands!");
      }

      consoleUtil.Success(`Loaded ${commandFiles.length} commands in ${folder} folder!`)
    }
  } catch (error) {
    consoleUtil.error(`An error occurred while loading commands: ${error}`);
  }

};