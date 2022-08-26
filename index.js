const Discord = require('discord.js')

const Client = require(`${process.cwd()}/struct/Client`);

const config = require(`${process.cwd()}/config`);

// create a new Discord client 
const client = new Client(config);

client.listentoProcessEvents([
  'unhandledRejection',
  'uncaughtException'
], { ignore: false });

const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env') })

const { Player } = require("discord-player")

const { registerPlayerEvents } = require('./events/MusicEvents');

client.player = new Player(client, client.config.ytdlOptions)

client.database?.init();

registerPlayerEvents(client.player);

["SlashHandler", "CommandHandler", "EventHandler"].forEach((handler) => {
	require(`./Handler/${handler}`)(client);
});

["Reminder", "checkQuests"].forEach((functions) => {
	require(`./functions/${functions}`)(client);
});

client.login(process.env.TOKEN_URI);
