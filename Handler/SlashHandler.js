const { error, success, info } = require('../util/console');
const areCommandsDifferent = require('../util/helpers/areCommandsDifferent');
const getApplicationCommands = require('../util/helpers/getApplicationCommands');
const getLocalCommands = require('../util/helpers/getLocalCommands');

/**
 * 
 * @param {import("../struct/Client")} client 
 * @param {string} directory directory containing the slash command files
 */
module.exports = async (client, directory) => {
  try {
    // Load all local slash commands
    const localCommands = getLocalCommands(directory);

    const devGuildId = client.config.slashCommands?.devGuild;
    const isGlobal = !client.config.slashCommands?.loadGlobal;
    const devGuild = isGlobal && devGuildId ? client.guilds.cache.get(devGuildId) : null;
    const guildId = devGuild?.id ?? null;

    console.log(`(/) Loading all slash commands ${guildId ? `to dev guild: ${devGuild.name}` : "globally."}`);
    const applicationCommands = await getApplicationCommands(client, guildId);

    for (const localCommand of localCommands) {
      const commandData = localCommand.data ?? localCommand;
      const { name, description, integration_types, contexts, options, deleted } = commandData;

      // Clear the cached module of each slash command
      if (localCommand.filePath) {
        try {
          delete require.cache[require.resolve(localCommand.filePath)];
        } catch (cacheError) {
         error(`❌ Error clearing cache for command "${name}": ${cacheError}`);
        }
      }

      const existingCommand = await applicationCommands.cache.find(
        (cmd) => cmd.name === name
      );

      try {
        if (existingCommand) {
          if (deleted) {
            await applicationCommands.delete(existingCommand.id);
            info(`🗑 Deleted command "${name}".`);
            continue;
          }

          if (areCommandsDifferent(existingCommand, commandData)) {
            await applicationCommands.edit(existingCommand.id, {
              description,
              options,
              integration_types,
              contexts,
            });

            info(`🔁 Edited command "${name}".`);
          }
        } else {
          if (deleted) {
            info(`⏩ Skipping registering command "${name}" as it's set to delete.`);
            continue;
          }

          await applicationCommands.create({
            name,
            description,
            options,
            integration_types,
            contexts,
          });

          info(`✔ Registered command "${name}."`);
        }
      } catch (cmdError) {
        error(`❌ Error processing command "${name}": ${cmdError}`);
      }
    }
  } catch (err) {
    error(`❌ Error while registering slash commands: ${err}`);
  }
};
