// connecting to discord
const Discord = require('discord.js')

// connect us to the config.json file
const config = require('./config.json');

require('discord-reply');

// create a new Discord client 
const client = new Discord.Client({disableEveryone: true, partials: ['MESSAGE', 'REACTION']});

require('discord-buttons')(client);

// require the fs module
const fs = require('fs');

const fetch = require('node-fetch')

const { prefix, developer } = require('./config.json');

const map = new Map();

const mongodb = require('./mongo')()

const cooldowns = new Discord.Collection();

client.commands = new Discord.Collection();

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

//Event - message
client.on("message", async message => {
    if(message.author.bot || !message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).split(/ +/g);
    if (!args.length) return message.channel.send(`You didn't pass any command to reload, ${message.author}!`);
    const commandName = args.shift().toLowerCase();

    const cmd = client.commands.get(commandName)
        //+ aliases: [""],
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!cmd) return message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`);
        try{

            //+ cooldown 1, //seconds(s)
            if (!cooldowns.has(cmd.name)) {
                cooldowns.set(cmd.name, new Discord.Collection());
            }
            
            const now = Date.now();
            const timestamps = cooldowns.get(cmd.name);
            const cooldownAmount = (cmd.cooldown || 3) * 1000;
            
            if (timestamps.has(message.author.id)) {
                const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
            
                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000;
                    return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${cmd.name}\` command.`).then(msg => {
                        setTimeout(() => { 
                            msg.delete()
                         }, 5000)
                        })
                }
            }
            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        //+ args: true/false,
        if (cmd.args && !args.length) {
            		let reply = `You didn't provide any arguments, ${message.author}!`;

                    //+ usage: '<> <>',
            		if (cmd.usage) {
            			reply += `\nThe proper usage would be: \`${prefix}${cmd.name} ${cmd.usage}\``;
            		}
            
            		return message.channel.send(reply);
                }
                 
                 //+ permissions: [""],
                 if (cmd.permissions) {
                     if (message.guild) {
                     	const authorPerms = message.channel.permissionsFor(message.author);
                     	if (!authorPerms || !authorPerms.has(cmd.permissions)) {
                            const PermsEmbed = new Discord.MessageEmbed()
                            .setColor(`RED`)
                            .setDescription(`<a:pp802:768864899543466006> You don't have \`${cmd.clientpermissions}\` permission(s) to use ${cmd.name} command.`)
                            return message.channel.send(PermsEmbed)
                         }
                    	}
                     }

                 //+ clientpermissions: [""],
                 if (cmd.clientpermissions) {
                    if (message.guild) {
                    const clientPerms = message.channel.permissionsFor(message.guild.me);
                    if (!clientPerms || !clientPerms.has(cmd.clientpermissions)) {
                        return message.reply(`<a:pp802:768864899543466006> The bot is missing \`${cmd.clientpermissions}\` permission(s)!`, true);
                    }
                   }
                }

                //+ guildOnly: true/false,
                if (cmd.guildOnly && message.channel.type === 'dm') {
                    return message.reply('<a:pp802:768864899543466006> I can\'t execute that command inside DMs!');
                }

                //+ dmOnly: true/false,
                if (cmd.dmOnly && message.channel.type === 'text') {
                    return message.reply('<a:pp802:768864899543466006> I can\'t execute that command inside the server!');
                }

                if(cmd.guarded) {
                    return message.reply(`<a:pp802:768864899543466006> ${cmd.name} is guarded!`)
                }

                if(cmd.OwnerOnly) {
                    if(message.author.id !== developer) return message.reply(`<a:pp802:768864899543466006> ${cmd.name} for developers only!`)
                }

                if (message.guild){
                    if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')){
                      return { executed: false, reason: 'PERMISSION_SEND'};
                    } else {
                      // Do nothing..
                    };
                  };

        cmd.execute(client, message, args);
    }catch(err){
        message.reply(`<a:Settings:841321893750505533> There was an error in the console.\n\`Please report this with a screenshot to ᒍoe#0001\``);
        console.log(err);
    }
})

// Login To Discord with your app's Token

client.login(process.env.token);
