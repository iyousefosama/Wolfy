const fs = require('fs');
const path = require('path');
const consoleUtil = require("../util/console");

module.exports = async (client) => {
  consoleUtil.warn("Reloading message commands...");
  try {
    // Clear all existing commands
    client.commands.clear();

    const commandFolders = fs.readdirSync('./commands');
    let success = 0;
    let failed = 0;

    for (const folder of commandFolders) {
      const folderPath = path.join(__dirname, `../commands/${folder}`);
      const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
      success = 0;
      failed = 0;

      for (const file of commandFiles) {
        try {
          const filePath = path.join(folderPath, file);
          
          // Clear the cached module
          delete require.cache[require.resolve(filePath)];
          
          const command = require(filePath);
          if (!command.name) {
            consoleUtil.error(`Command file '${file}' is missing a 'name' property.`);
            failed++;
            continue;
          }
          client.commands.set(command.name, command);
          consoleUtil.Success(`'${command.name}' from '${file}'`, "Loaded command:");
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
