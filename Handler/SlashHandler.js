const { error, success, info } = require('../util/console');
const areCommandsDifferent = require('../util/helpers/areCommandsDifferent');
const getApplicationCommands = require('../util/helpers/getApplicationCommands');
const getLocalCommands = require('../util/helpers/getLocalCommands');
const fs = require('fs');
const path = require('path');

// Cache file to track commands that have had integration_types/contexts set
const CACHE_FILE = path.join(__dirname, '../.command-contexts-cache.json');

/**
 * Load the cache from file
 */
function loadCache() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    }
  } catch (err) {
    // Ignore cache errors
  }
  return {};
}

/**
 * Save the cache to file
 */
function saveCache(cache) {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
  } catch (err) {
    // Ignore cache errors
  }
}

/**
 *
 * @param {import("../struct/Client")} client
 * @param {string} directory directory containing the slash command files
 */
module.exports = async (client, directory) => {
  try {
    const localCommands = getLocalCommands(directory);
    const { slashCommands } = client.config;
    const contextsCache = loadCache();

    const devGuildId = slashCommands?.devGuild;
    const isGlobal = !!slashCommands?.loadGlobal;
    const devGuild = !isGlobal && devGuildId ? client.guilds.cache.get(devGuildId) : null;
    const guildId = devGuild?.id ?? null;

    console.log(`(/) Loading slash commands ${guildId ? `to dev guild: ${devGuild.name}` : "globally."}`);

    const applicationCommands = await getApplicationCommands(client, guildId);

    // 🗑️ DELETE_ALL: Delete all existing commands before re-registering
    if (slashCommands.DELETE_ALL) {
      for (const [cmdId, cmd] of applicationCommands.cache) {
        await applicationCommands.delete(cmdId);
        info(`🗑 Deleted old command "${cmd.name}".`);
      }
    }

    for (const localCommand of localCommands) {
      const commandData = localCommand.data ?? localCommand;
      const { name, description, integration_types, contexts, options, deleted } = commandData;

      // Clear the cached module
      if (localCommand.filePath) {
        try {
          delete require.cache[require.resolve(localCommand.filePath)];
        } catch (cacheError) {
          error(`❌ Error clearing cache for command "${name}": ${cacheError}`);
        }
      }

      const existingCommand = await applicationCommands.cache.find(cmd => cmd.name === name);
      const cacheKey = guildId ? `${guildId}-${name}` : `global-${name}`;
      const skipIntegrationContexts = contextsCache[cacheKey] === true;

      try {
        if (existingCommand) {
          if (deleted) {
            await applicationCommands.delete(existingCommand.id);
            delete contextsCache[cacheKey];
            info(`🗑 Deleted command "${name}".`);
            continue;
          }

          const shouldForceUpdate = slashCommands.forceUpdate;
          const isDifferent = areCommandsDifferent(existingCommand, commandData, skipIntegrationContexts);

          if (shouldForceUpdate || isDifferent) {
            await applicationCommands.edit(existingCommand.id, {
              description,
              options,
              integration_types,
              contexts,
            });

            // Mark this command as having integration_types/contexts set
            if (integration_types || contexts) {
              contextsCache[cacheKey] = true;
            }

            info(`${shouldForceUpdate ? "🔁 Force-updated" : "🔄 Updated"} command "${name}".`);
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

          // Mark this command as having integration_types/contexts set
          if (integration_types || contexts) {
            contextsCache[cacheKey] = true;
          }

          info(`✔ Registered command "${name}".`);
        }
      } catch (cmdError) {
        error(`❌ Error processing command "${name}": ${cmdError}`);
      }
    }

    // Save cache after processing all commands
    saveCache(contextsCache);
  } catch (err) {
    error(`❌ Error while registering slash commands: ${err}`);
  }
};
