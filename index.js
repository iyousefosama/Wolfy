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

// require the fs module
const fs = require('fs');

const fetch = require('node-fetch')

const userSchema = require('./schema/user-schema')
const schema = require('./schema/GuildSchema')

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const { developer, clientId } = require('./config.json');

const map = new Map();

const mongodb = require('./mongo')()

const cooldowns = new Collection();

client.commands = new Discord.Collection();

client.slashCommands = new Collection();

const commands=[]

const { AutoPoster } = require('topgg-autoposter')

const ap = AutoPoster('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjgyMTY1NTQyMDQxMDAwMzQ5NyIsImJvdCI6dHJ1ZSwiaWF0IjoxNjI5MDgxMTI5fQ.UGbgw0PHpYuydbBJ4HNA6eRzQrlO8DZmRDxY1MBXids', client)

ap.on('posted', () => {
  console.log('Posted stats to Top.gg!')
})

const slashFiles = fs.readdirSync('./slashCommands').filter(file => file.endsWith('.js'));
for (const file of slashFiles) {
    const slash = require(`./slashCommands/${file}`);
    client.slashCommands.set(file.split(/.js$/)[0],slash);
    commands.push(slash.data.toJSON());
}


		//Once the Bot is ready, add all Slas Commands to each guild
		client.on("ready", () => {
			if(config.loadSlashsGlobal){
                                client.application.commands.set(commands)
				.then(slashCommandsData => {
					console.log(`(/) ${slashCommandsData.size} slashCommands ${`(With ${slashCommandsData.map(d => d.options).flat().length} Subcommands)`} Loaded for ${`All possible Guilds`}`); 
					console.log(`Because u are Using Global Settings, it can take up to 1 hour until the Commands are changed!`)
				}).catch((e)=>console.log(e));
			} else {
				client.guilds.cache.map(g => g).forEach((guild) => {
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
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const slash = client.slashCommands.get(interaction.commandName);

    if(interaction.user.bot) return;
    if (!slash) return;

    try {
        if (slash.guildOnly && interaction.channel.type === 'DM') {
            return interaction.reply({ content: '<a:pp802:768864899543466006> I can\'t execute that command inside DMs!', ephemeral: true });
        }
  //+ permissions: [""],
  if (slash.permissions) {
    if (interaction.guild) {
        const sauthorPerms = interaction.channel.permissionsFor(interaction.user);
        if (!sauthorPerms || !sauthorPerms.has(slash.permissions)) {
           const sPermsEmbed = new Discord.MessageEmbed()
           .setColor(`RED`)
           .setDescription(`<a:pp802:768864899543466006> You don't have \`${slash.permissions}\` permission(s) to use ${slash.name} command.`)
           return interaction.reply({ embeds: [sPermsEmbed], ephemeral: true })
        }
       }
    }
//+ clientpermissions: [""],
if (slash.clientpermissions) {
   if (interaction.guild) {
   const sclientPerms = interaction.channel.permissionsFor(interaction.guild.me);
   if (!sclientPerms || !sclientPerms.has(slash.clientpermissions)) {
       return interaction.reply({ content: `<a:pp802:768864899543466006> The bot is missing \`${slash.clientpermissions}\` permission(s)!`, ephemeral: true });
   }
  }
}                       
        await slash.execute(client, interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

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
client.on("messageCreate", async message => {

        let data;
    let prefix;
    if (message.guild) {
    try{
        data = await schema.findOne({
            GuildID: message.guild.id
        })
    } catch(err) {
        console.log(err)
    }
}
    if (message.content.startsWith('wolfy ')){
        prefix = 'wolfy '
      } else if(message.channel.type === 'DM') {
        prefix = config.prefix;
      } else if (!data || data.prefix == null){
        prefix = config.prefix;
      } else if (data && message.content.startsWith(data.prefix)){
        prefix = data.prefix;
      };
    
      if (!prefix){
        return { executed: false, reason: 'PREFIX'};
      };

    if(message.author.bot || !message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).split(/ +/g);
    if (!args.length) return message.channel.send({ content: `You didn't pass any command to reload, ${message.author}!`});
    const commandName = args.shift().toLowerCase();

    const cmd = client.commands.get(commandName)
        //+ aliases: [""],
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if(commandName.length < 1) return;
        if (!cmd) return message.channel.send({ content: `There is no command with name or alias \`${commandName}\`, ${message.author}!`});
        
                //+ Blacklisted
                try {
                    UserData = await userSchema.findOne({
                        userId: message.author.id
                    })
                    if(!UserData) {
                        UserData = await userSchema.create({
                            userId: message.author.id
                        })
                    }
                } catch (error) {
                    console.log(error)
                }
                if(UserData.blacklisted == true) return message.channel.send({ content: `\`\`\`diff\n- You are blacklisted from using the bot!\`\`\``})

        try{


            //+ args: true/false,
        if (cmd.args && !args.length) {
            let desc = `You didn't provide any arguments`;

            //+ usage: '<> <>',
            if (cmd.usage) {
                desc += `, The proper usage would be:\n\`${prefix}${cmd.name} ${cmd.usage}\``;
            }
            if (cmd.examples && cmd.examples.length !== 0) {
                desc += `\n\nExamples:\n${cmd.examples.map(x=>`\`${prefix}${cmd.name} ${x}\n\``)}`;
            }
    
            const NoArgs = new Discord.MessageEmbed()
            .setDescription(desc)
            .setColor('RED')
            return message.channel.send({ embeds: [NoArgs] });
        }

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
                    return message.channel.send({ content: ` **${message.author.username}**, please cool down! (**${timeLeft.toFixed(0)}** second(s) left)`}).then(msg => {
                        setTimeout(() => {
                            msg.delete().catch(() => null)
                         }, 3000)
                        })
                }
            }
            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
                 
                 //+ permissions: [""],
                 if (cmd.permissions) {
                     if (message.guild) {
                     	const authorPerms = message.channel.permissionsFor(message.author);
                     	if (!authorPerms || !authorPerms.has(cmd.permissions)) {
                            const PermsEmbed = new Discord.MessageEmbed()
                            .setColor(`RED`)
                            .setDescription(`<a:pp802:768864899543466006> You don't have \`${cmd.permissions}\` permission(s) to use ${cmd.name} command.`)
                            return message.channel.send({ embeds: [PermsEmbed] })
                         }
                    	}
                     }

                 //+ clientpermissions: [""],
                 if (cmd.clientpermissions) {
                    if (message.guild) {
                    const clientPerms = message.channel.permissionsFor(message.guild.me);
                    if (!clientPerms || !clientPerms.has(cmd.clientpermissions)) {
                        return message.reply({ content: `<a:pp802:768864899543466006> The bot is missing \`${cmd.clientpermissions}\` permission(s)!`, allowedMentions: { repliedUser: false }});
                    }
                   }
                }

                //+ guildOnly: true/false,
                if (cmd.guildOnly && message.channel.type === 'DM') {
                    return message.reply({ content: '<a:pp802:768864899543466006> I can\'t execute that command inside DMs!', allowedMentions: { repliedUser: false }});
                }

                //+ dmOnly: true/false,
                if (cmd.dmOnly && message.channel.type === 'GUILD_TEXT') {
                    return message.reply({ content: '<a:pp802:768864899543466006> I can\'t execute that command inside the server!', allowedMentions: { repliedUser: false }});
                }

                if(cmd.guarded) {
                    return message.reply({ content: `<a:pp802:768864899543466006> ${cmd.name} is guarded!`, allowedMentions: { repliedUser: false }})
                }

                if(cmd.OwnerOnly) {
                    if(message.author.id !== developer) return message.reply({ content: `<a:pp802:768864899543466006> ${cmd.name} for developers only!`, allowedMentions: { repliedUser: false }})
                }

                if (message.guild){
                    if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')){
                      return { executed: false, reason: 'PERMISSION_SEND'};
                    } else {
                      // Do nothing..
                    };
                  };
                  if (message.guild){
                    if (!message.channel.permissionsFor(message.guild.me).has('VIEW_CHANNEL')){
                      return;
                    } else {
                      // Do nothing..
                    };
                  };
                  if (message.guild){
                    if (!message.channel.permissionsFor(message.guild.me).has('READ_MESSAGE_HISTORY')){
                      return message.channel.send({ content: '"Missing Access", the bot is missing the \`READ_MESSAGE_HISTORY\` permission please enable it!'})
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
