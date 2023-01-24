const discord = require('discord.js')
const { Client, Intents, Collection } = require('discord.js')
const fs = require('fs');

/**
 * @param {Client} client
 */

module.exports = async (client) => {
    client.commands = new discord.Collection();

    const commandFolders = fs.readdirSync('./commands');
for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`../commands/${folder}/${file}`);
        client.commands.set(command.name, command);
    } 
    if (commandFiles.length <= 0) {
        console.log("Can't find any commands!");
      }

      commandFiles.forEach(cmd => {
        // console the loaded cmds 
        var commandFiles = require(`../commands/${folder}/${cmd}`);
        console.log(`File ${cmd} was loaded`)
      })
}
};