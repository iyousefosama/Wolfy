const Discord = require('discord.js')

const Client = require(`${process.cwd()}/struct/Client`);

const config = require(`${process.cwd()}/config`);

// create a new Discord client 
const client = new Client(config);

client.listentoProcessEvents([
  'unhandledRejection',
  'uncaughtException'
], { ignore: false });


["SlashHandler", "CommandHandler", "EventHandler"].forEach((handler) => {
	require(`./Handler/${handler}`)(client);
});

["Reminder", "checkQuests", "Modules"].forEach((functions) => {
	require(`./functions/${functions}`)(client);
});

client.login(process.env.TOKEN_URI);
