const consoleUtil = require(`../util/console`);
const areCommandsDifferent = require('../util/helpers/areCommandsDifferent');
const getApplicationCommands = require('../util/helpers/getApplicationCommands');
const getLocalCommands = require('../util/helpers/getLocalCommands');

const BEV = require("../util/types/baseEvents");

/** @type {BEV.BaseEvent<"ready">} */
module.exports = {
  name: 'ready',
  once: true,
  /**
  * @param {Client} client
  */
  async execute(client) {
    try {
      const localCommands = getLocalCommands();
      const applicationCommands = await getApplicationCommands(
        client
      );

      for (const localCommand of localCommands) {
        const { name, description, options } = localCommand;

        const existingCommand = await applicationCommands.cache.find(
          (cmd) => cmd.name === name
        );

        if (existingCommand) {
          if (localCommand.deleted) {
            await applicationCommands.delete(existingCommand.id);
            console.log(`🗑 Deleted command "${name}".`);
            continue;
          }

          if (areCommandsDifferent(existingCommand, localCommand)) {
            await applicationCommands.edit(existingCommand.id, {
              description,
              options,
            });

            console.log(`🔁 Edited command "${name}".`);
          }
        } else {
          if (localCommand.deleted) {
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
  }
}
