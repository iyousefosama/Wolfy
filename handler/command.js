const { Client } = require("discord.js");
const { glob } = require("glob");
const { promisify } = require("util");
const globPromise = promisify(glob);
const { readdirSync } = require("fs");
const ascii = require("ascii-table");
let table = new ascii("Commands");
const { REST } = require('@discordjs/rest');
const { token } = require('./config.json');
table.setHeading("Command", "Load status");

/**
 * @param {Client} client
 */

module.exports = async (client) => {
  // slashcommands start
  const slashCommands = await globPromise(
    `${process.cwd()}/SlashCommands/*/*.js`
);

const arrayOfSlashCommands = [];
slashCommands.map((value) => {
    const file = require(value);
    if (!file?.name) return;
    client.slashCommands.set(file.name, file);
    arrayOfSlashCommands.push(file);
});

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

    client.guilds.cache.forEach(async (g) => {
      await client.guilds.cache.get(g.id).commands.set(arrayOfSlashCommands)
    })

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
});

}; 
