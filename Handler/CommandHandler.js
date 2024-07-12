const fs = require('fs');
const path = require('path');
const consoleUtil = require("../util/console");

/**
 * 
 * @param {import("../struct/Client")} client 
 * @param {string} directory directory containing the event files
 */
module.exports = async (client, directory) => {
  consoleUtil.warn("message commands...", "Loading:");
  try {
    // Clear all existing commands
    client.commands.clear();

    if(!directory) {
      throw new Error('No directory provided!');
    }
    const commandFolders = fs.readdirSync(path.join(__dirname, "..", directory));
    let success = 0;
    let failed = 0;

    for (const folder of commandFolders) {
      const folderPath = path.join(__dirname, "..", directory, `${folder}`);
      const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
      success = 0;
      failed = 0;

      for (const file of commandFiles) {
        try {
          const filePath = path.join(folderPath, file);
          
          // Clear the cached module
          delete require.cache[require.resolve(filePath)];
          /**
           * @type {import("../util/types/baseCommand")}
           */
          const command = require(filePath);
          // ? Note: All client commands are set and recieved from user in lowercase!
          const cmdName = command.name.toLowerCase();
          
          if (!cmdName) {
            consoleUtil.error(`Command file '${file}' is missing a 'name' property.`);
            failed++;
            continue;
          }
          client.commands.set(cmdName, command);
          consoleUtil.Success(`'${cmdName}' from '${file}'`, "Loaded command:");
          success++;
        } catch (error) {
          consoleUtil.error(`Error loading command '${file}': ${error}`);
          failed++;
        }
      }

      if (commandFiles.length === 0) {
        consoleUtil.error(`No command files found in folder '${folder}'`);
      } else {
        consoleUtil.Success(`Loaded ${success} commands from '${folder}' folder!`, "# CMD FOLDER LOADED:");
        failed > 0 ? consoleUtil.error(`Failed to load ${failed} commands from '${folder}' folder!`) : "";
      }
    }
  } catch (error) {
    consoleUtil.error(`An error occurred while loading commands: ${error}`);
  }
};
