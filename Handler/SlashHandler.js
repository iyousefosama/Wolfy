const { Dir } = require('fs');
const consoleUtil = require(`../util/console`);
const areCommandsDifferent = require('../util/helpers/areCommandsDifferent');
const getApplicationCommands = require('../util/helpers/getApplicationCommands');
const getLocalCommands = require('../util/helpers/getLocalCommands');

/**
 * 
 * @param {import("../struct/Client")} client 
 * @param {Dir} directory directory containing the event files
 */
module.exports = async (client, directory) => {
  try {
    const localCommands = getLocalCommands(directory);

    const devGuildId = client.config.slashCommands?.devGuild;
    const isGlobal = !client.config.slashCommands?.loadGlobal;
    const devGuild = isGlobal && devGuildId ? client.guilds.cache.get(devGuildId) : null;
    const guildId = devGuild?.id ?? null;
    
    console.log(`(/) Loading all slash commands ${guildId ? `to dev guild: ${devGuild.name}` : "globally."}`);
    const applicationCommands = await getApplicationCommands(client, guildId);

    for (const localCommand of localCommands) {
      const commandData = localCommand.data;
      const { name, description, options, deleted } = commandData;

      const existingCommand = await applicationCommands.cache.find(
        (cmd) => cmd.name === name
      );

      if (existingCommand) {
        if (deleted) {
          await applicationCommands.delete(existingCommand.id);
          console.log(`🗑 Deleted command "${name}".`);
          continue;
        }

        if (areCommandsDifferent(existingCommand, commandData)) {
          await applicationCommands.edit(existingCommand.id, {
            description,
            options,
          });

          console.log(`🔁 Edited command "${name}".`);
        }
      } else {
        if (deleted) {
          console.log(
            `⏩ Skipping registering command "${name}" as it's set to delete.`
          );
          continue;
        }

        try {
          await applicationCommands.create({
            name,
            description,
            options,
          });

          console.log(`✅ Registered command "${name}."`);
        } catch (error) {
          consoleUtil.error(`❌ There was an error while creating [${name}] command: ${error}`);
        }
      }
    }
  } catch (error) {
    consoleUtil.error(`❌ There was an error while registering slash commands: ${error}`);
  }
};
