const fs = require('fs');
const path = require('path');
const { warn, error, success, info } = require("../util/console");
const baseCommand = require("../util/types/baseCommand");

/**
 * 
 * @param {import("../struct/Client")} client 
 * @param {string} directory directory containing the event files
 */
module.exports = async (client, directory) => {
  info("loading message commands...");
  try {
    // Clear all existing commands
    client.commands.clear();

    if(!directory) {
      throw new Error('No message commands directory provided!');
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
           * @type {baseCommand}
           */
          const command = require(filePath);
          // ? Note: All client commands are set and recieved from user in lowercase!
          const cmdName = command.name.toLowerCase();
          
          if (!cmdName) {
            error(`Command file '${file}' is missing a 'name' property.`);
            failed++;
            continue;
          }
          client.commands.set(cmdName, command);
          //consoleUtil.success(`'${cmdName}' from '${file}'`, "Loaded command:");
          success++;
        } catch (err) {
          error(`Error loading command '${file}': ${err}`);
          failed++;
        }
      }

      if (commandFiles.length === 0) {
        error(`No command files found in folder '${folder}'`);
      } else {
        info(`Loaded ${success} message commands from '${folder}' folder!`);
        failed > 0 ? error(`Failed to load ${failed} commands from '${folder}' folder!`) : "";
      }
    }
  } catch (err) {
    error(`An error occurred while loading commands: ${err}`);
  }
};
