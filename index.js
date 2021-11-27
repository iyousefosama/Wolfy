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

const client = new Discord.Client() // Your discord.js or eris client (or djs ShardingManager)
const { AutoPoster } = require('topgg-autoposter')

const ap = AutoPoster('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjgyMTY1NTQyMDQxMDAwMzQ5NyIsImJvdCI6dHJ1ZSwiaWF0IjoxNjM4MDIzMDk5fQ.Wn4v6cvEpY9Ztayqjdf-rmLiB8CE0UskYrEFtv33ap8', client)

// require the fs module
const fs = require('fs');

const fetch = require('node-fetch')

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const { developer, clientId } = require('./config.json');

const map = new Map();

const mongodb = require('./mongo')()

client.commands = new Discord.Collection();

client.slashCommands = new Collection();

const commands=[]

const slashFiles = fs.readdirSync('./slashCommands').filter(file => file.endsWith('.js'));
for (const file of slashFiles) {
    if (slashFiles.length <= 0) {
        console.log("(/) Can't find any slash commands!");
        return;
      }
    const slash = require(`./slashCommands/${file}`);
    client.slashCommands.set(file.split(/.js$/)[0],slash);
    commands.push(slash.data.toJSON());
}


		//Once the Bot is ready, add all Slas Commands to each guild
		client.on("ready", async () => {
			if(config.loadSlashsGlobal){
				client.application.commands.set(commands)
				.then(slashCommandsData => {
					console.log(`(/) ${slashCommandsData.size} slashCommands ${`(With ${slashCommandsData.map(d => d.options).flat().length} Subcommands)`} Loaded for ${`All possible Guilds`}`); 
				}).catch((e)=>console.log(e));
			} else {
				client.guilds.cache.map(g => g).forEach(async (guild) => {
					try{
						guild.commands.set(commands)
						.then(slashCommandsData => {
							console.log(`(/) ${slashCommandsData.size} slashCommands ${`(With ${slashCommandsData.map(d => d.options).flat().length} Subcommands)`} Loaded for: ${`${guild.name}`}`); 
						}).catch((e)=>console.log(e))
					}catch (e){
						console.log(e)
					}
				});
			}
		})

const commandFolders = fs.readdirSync('./commands');
for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.name, command);
    } 
    if (commandFiles.length <= 0) {
        console.log("Can't find any commands!");
        return;
      }

      commandFiles.forEach(cmd => {
        // console the loaded cmds 
        var commandFiles = require(`./commands/${folder}/${cmd}`);
        console.log(`File ${cmd} was loaded`)
      })
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(client, ...args));
	} else {
		client.on(event.name, (...args) => event.execute(client, ...args));
    	}
    }

// Login To Discord with your app's Token

client.login(process.env.TOKEN_URI);
