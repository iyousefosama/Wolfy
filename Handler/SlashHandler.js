const Discord = require('discord.js')
const { Client, Intents, Collection } = require('discord.js')
const fs = require('fs');
const config = require('../config.json');
const commands=[]

/**
 * @param {Client} client
 */

module.exports = async (client) => {
    client.commands = new Discord.Collection();
    client.slashCommands = new Collection();

    const slashFiles = fs.readdirSync('./slashCommands').filter(file => file.endsWith('.js'));
for (const file of slashFiles) {
    if (slashFiles.length <= 0) {
        console.log("(/) Can't find any slash commands!");
    }
    const slash = require(`../slashCommands/${file}`);
    client.slashCommands.set(file.split(/.js$/)[0],slash);
    commands.push(slash.data.toJSON());
}


		client.on("ready", async () => {
            await new Promise(r=>setTimeout(r,1500))
            client.user.setPresence({ activities: [{ name: 'Loading...', type: "COMPETING" }], status: 'dnd' });
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
};