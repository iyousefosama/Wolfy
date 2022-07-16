// connecting to discord
const Discord = require('discord.js')
const { Client, Intents, Collection } = require('discord.js')

// connect us to the config.json file
const config = require('./config.json');

// create a new Discord client 
const client = new Client({
     partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
     intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_BANS],
     allowedMentions: { parse: ['users', 'roles'], repliedUser: true }
    });

client.config = config;

const { Player } = require("discord-player")

const { registerPlayerEvents } = require('./events/MusicEvents');

client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25,
		dlChunkSize: 0
    }
});

const mongodb = require('./mongo')()

registerPlayerEvents(client.player);

["SlashHandler", "CommandHandler", "EventHandler"].forEach((handler) => {
	require(`./Handler/${handler}`)(client);
});

["Reminder"].forEach((functions) => {
	require(`./functions/${functions}`)(client);
});

client.login(process.env.TOKEN_URI);
