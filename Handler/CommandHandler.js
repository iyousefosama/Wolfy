const fs = require('fs');
const path = require('path');
const { Collection } = require('discord.js');
const consoleUtil = require("../util/console");

module.exports = async (client) => {
  consoleUtil.warn("Loading message commands...");
  try {
    client.commands = new Collection();

    const commandFolders = fs.readdirSync('./commands');

    for (const folder of commandFolders) {
      const folderPath = path.join(__dirname, `../commands/${folder}`);
      const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

      for (const file of commandFiles) {
        try {
          const command = require(path.join(folderPath, file));
          if (!command.name) {
            consoleUtil.error(`Command file '${file}' is missing a 'name' property.`);
            continue;
          }
          client.commands.set(command.name, command);
          consoleUtil.Success(`'${command.name}' from '${file}'`, "Loaded command:");
        } catch (error) {
          consoleUtil.error(`Error loading command '${file}': ${error}`);
        }
      }

      if (commandFiles.length === 0) {
        consoleUtil.error(`No command files found in folder '${folder}'`);
      } else {
        consoleUtil.Success(`Loaded ${commandFiles.length} commands from '${folder}' folder!`, "# CMD FOLDER LOADED:");
      }
    }
  } catch (error) {
    consoleUtil.error(`An error occurred while loading commands: ${error}`);
  }
};
