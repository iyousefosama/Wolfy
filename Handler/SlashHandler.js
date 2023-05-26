const discord = require('discord.js')
const { Client } = require('discord.js')
const fs = require('fs');
const commands=[]
const path = require('path');

/**
 * @param {Client} client
 */

module.exports = async (client) => {
client.slashCommands = new discord.Collection();

function readCommands(dir) {
  const folders = fs.readdirSync(dir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  for (const folder of folders) {
    const folderPath = path.join(dir, folder);
    const files = fs.readdirSync(folderPath)
      .filter(file => file.endsWith('.js'));

    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const slash = require(filePath);
      client.slashCommands.set(file.split(/.js$/)[0], slash);
      commands.push(slash.data.toJSON());
    }
  }
}

const slashCommandsDir = path.join(__dirname, '../slashCommands');
readCommands(slashCommandsDir);
  
		client.on("ready", async () => {
            await new Promise(r=>setTimeout(r,1500))
            client.user.setPresence({ activities: [{ name: 'Loading...', type: "COMPETING" }], status: 'dnd' });
			if(client.config.loadSlashsGlobal){
				client.application.commands.set(commands)
				.then(slashCommandsData => {
					console.log(`(/) ${slashCommandsData.size} slashCommands ${`(With ${slashCommandsData.map(d => d.options).flat().length} Subcommands)`} Loaded for as a public commands`); 
				}).catch((e)=>console.log(e));
			} else {
				client.guilds.cache.map(g => g).forEach(async (guild) => {
					try{
						guild.commands.set(commands)
						.then(slashCommandsData => {
							console.log(`(/) ${slashCommandsData.size} slashCommands ${`(With ${slashCommandsData.map(d => d.options).flat().length} Subcommands)`} Loaded for ${`${guild.name}`}!`); 
						}).catch((e)=>console.log(e))
					}catch (e){
						console.log(e)
					}
				});
			}
		})
};