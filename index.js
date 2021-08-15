// connecting to discord
const Discord = require('discord.js')

// connect us to the config.json file
const config = require('./config.json');

require('discord-reply');

// create a new Discord Client 
const Client = new Discord.Client({disableEveryone: true, partials: ['MESSAGE', 'REACTION']});

require('discord-buttons')(Client);

// we make a new system for the cmds
Client.commands = new Discord.Collection();

// require the fs module
const fs = require('fs');

const fetch = require('node-fetch')

const prefix = ('w!');

// it creates a new function for our aliases
Client.aliases = new Discord.Collection();

const map = new Map();

const snipes = new Discord.Collection()

const mongodb = require('./mongo')()

// it creates a new function for our aliases
Client.aliases = new Discord.Collection();

// it creates a new function for our cooldowns
const cooldown = new Set();

const userSchema = require("./schema/user-schema")

const Levels = require("discord-xp");

const canvacord = require("canvacord");

Client.on('clickMenu', async menu => {
    const Member = await menu.message.guild.members.fetch({ user: menu.clicker.user.id, force: true})
    if(menu.values[0] == 'DR1') {
        if(!Member.roles.cache.has('836422893696450590')) {
            await Member.roles.add('836422893696450590')
            return menu.reply.send("<a:pp330:853495519455215627> You got the All Annoucments mention role", true)
        } else if(Member.roles.cache.has('836422893696450590')) {
            await Member.roles.remove('836422893696450590')
            return menu.reply.send("<a:pp833:853495989796470815> Removed the All Annoucments mention role", true)
        }
    }

    if(menu.values[0] == 'DR2') {
        if(!Member.roles.cache.has('836422786247294976')) {
            await Member.roles.add('836422786247294976')
            return menu.reply.send("<a:pp330:853495519455215627> You got the Free Games Mention role", true)
        } else if(Member.roles.cache.has('836422786247294976')) {
            await Member.roles.remove('836422786247294976')
            return menu.reply.send("<a:pp833:853495989796470815> Removed the Free Games Mention role", true)
        }
    }
    if(menu.values[0] == 'DR3') {
        if(!Member.roles.cache.has('836423291601944596')) {
            await Member.roles.add('836423291601944596')
            return menu.reply.send("<a:pp330:853495519455215627> You got the Looking For group mention role", true)
        } else if(Member.roles.cache.has('836423291601944596')) {
            await Member.roles.remove('836423291601944596')
            return menu.reply.send("<a:pp833:853495989796470815> Removed the Looking For group mention role", true)
        }
    }
    if(menu.values[0] == 'DR4') {
        if(!Member.roles.cache.has('836422784317259777')) {
            await Member.roles.add('836422784317259777')
            return menu.reply.send("<a:pp330:853495519455215627> You got the Watching party mention role", true)
        } else if(Member.roles.cache.has('836422784317259777')) {
            await Member.roles.remove('836422784317259777')
            return menu.reply.send("<a:pp833:853495989796470815> Removed the Watching party mention role", true)
        }
    }
    if(menu.values[0] == 'DR5') {
        if(!Member.roles.cache.has('870351250502340680')) {
            await Member.roles.add('870351250502340680')
            return menu.reply.send("<a:pp330:853495519455215627> You got the Partner mention role", true)
        } else if(Member.roles.cache.has('870351250502340680')) {
            await Member.roles.remove('870351250502340680')
            return menu.reply.send("<a:pp833:853495989796470815> Removed the highest hit role", true)
        }
    }

    if(menu.values[0] == 'DRreturn') {
        return menu.reply.defer()
    }
})

Client.on("guildCreate", guild => {
    const join = new Discord.MessageEmbed()
    .setTitle(`${Client.user.username} added to a new server!`)
    .setColor("GREEN")
    .setThumbnail(guild.iconURL({dynamic: true, format: 'png', size: 512}))
    .setDescription(`<a:pp224:853495450111967253> Server Name:\n\`\`\`${guild.name}\`\`\` \n<:pp833:853495153280155668> MembersCount:\n\`\`\`${guild.memberCount}\`\`\`\n\n<a:pp330:853495519455215627> Total servers: \`\`\`\n${Client.guilds.cache.size}\`\`\`\n<a:pp330:853495519455215627> Total users: \n\`\`\`${Client.users.cache.size}\`\`\``)
    .setTimestamp()
    const LogChannel = Client.channels.cache.get('840892477614587914')
    LogChannel.send(join)
})
Client.on("guildDelete", guild => {
    const left = new Discord.MessageEmbed()
    .setTitle(`${Client.user.username} left a server!`)
    .setThumbnail(guild.iconURL({dynamic: true, format: 'png', size: 512}))
    .setColor("RED")
    .setDescription(`I left **${guild.name}**, with **${guild.memberCount}** members\n\nTotal servers: ${Client.guilds.cache.size}\nTotal users: ${Client.users.cache.size}`)
    .setDescription(`<a:pp224:853495450111967253> Server Name:\n\`\`\`${guild.name}\`\`\` \n<:pp833:853495153280155668> MembersCount:\n\`\`\`${guild.memberCount}\`\`\`\n\n<a:pp833:853495989796470815> Total servers: \`\`\`\n${Client.guilds.cache.size}\`\`\`\n<a:pp833:853495989796470815> Total users: \n\`\`\`${Client.users.cache.size}\`\`\``)
    .setTimestamp()
    const LogChannel = Client.channels.cache.get('840892477614587914')
    LogChannel.send(left)
})

Client.on('messageDelete', message => {
    if (message.author == Client.user) return;
    if (message.channel.type === "dm") return;
    snipes.set(message.channel.id, message)

    const LogChannel = message.guild.channels.cache.get('831412872852013066')
    if (!LogChannel) return
    const DeletedLog = new Discord.MessageEmbed()
    .setTitle("Deleted Message")
    .setDescription(`**User:** ${message.author.tag}\n**User ID:** ${message.author.id}**\nIn: ${message.channel}**\n**At:** ${new Date()}\n\n**Content:** \`\`\`${message.content}\`\`\``)
    .setColor('RED')
    .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
    LogChannel.send(DeletedLog)
}) 
Client.on('messageUpdate', async(oldMessage, newMessage) => {
    if (oldMessage.author == Client.user) return;
    if (oldMessage.channel.type === "dm") return;
    const LogChannel = oldMessage.guild.channels.cache.get('831412872852013066')
    if (!LogChannel) return
    const EditedLog = new Discord.MessageEmbed()
    .setTitle("Edited Message")
    .setDescription(`**User:** ${oldMessage.author.tag}\n**User ID:** ${oldMessage.author.id}\n**In: ${oldMessage.channel}**\n**At:** ${new Date()}\n\nOld Message: \`\`\`${oldMessage.content}\`\`\`\nNew Message: \`\`\`${newMessage.content}\`\`\``)
    .setColor('GOLD')
    .setThumbnail(oldMessage.author.displayAvatarURL({dynamic: true}))
    await LogChannel.send(EditedLog)
})

// Commands Handler 

// get into the cmds folder
fs.readdirSync('./commands/').forEach(dir => {

    //in the cmds folder, we gonna check for the category
    fs.readdir(`./commands/${dir}`, (err, files) => {

        // console log err (catch err)
        if (err) throw err;

         // checking if the files ends with .js if its a javascript file
        var jsFiles = files.filter(f => f.split(".").pop() === "js");

         // if there is no cmds in the file it will return
        if (jsFiles.length <= 0) {
          console.log("Can't find any commands!");
          return;
        }

        
        jsFiles.forEach(file => {

            // console the loaded cmds 
            var fileGet = require(`./commands/${dir}/${file}`);
            console.log(`File ${file} was loaded`)

            // gonna let the cmds run
            try {
                Client.commands.set(fileGet.help.name, fileGet);

                // it search in the cmds folder if there is any aliases
                fileGet.help.aliases.forEach(alias => {
                    Client.aliases.set(alias, fileGet.help.name);
                })

            } catch (err) {
              // catch err in console  
                return console.log(err);
            }
        });
    });
});

//XP
Client.on('message', async message => {
    if (message.channel.type === "dm") return;
    if (!message.guild.me.permissions.has("SEND_MESSAGES") || !message.guild.me.permissions.has("EMBED_LINKS") || !message.guild.me.permissions.has("USE_EXTERNAL_EMOJIS") || !message.guild.me.permissions.has("ADD_REACTIONS") || !message.guild.me.permissions.has("VIEW_CHANNEL") || !message.guild.me.permissions.has("ATTACH_FILES") || !message.guild.me.permissions.has("READ_MESSAGE_HISTORY") || !message.guild.me.permissions.has("READ_MESSAGE_HISTORY")) return;
    if (message.author == Client.user) return;
    if (message.author.bot) return;

    const randomXp = Math.floor(Math.random() * 46) + 1;
    const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, randomXp);

    if(hasLeveledUp) {
        const User = await Levels.fetch(message.author.id, message.guild.id);

        const LevelUp = new Discord.MessageEmbed()
        .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({dynamic: true, size: 2048}))
        .setDescription(`${message.author}, You have leveled up to level **${User.level}!** <a:pp330:853495519455215627>`)
        .setColor("DARK_GREEN")
        .setTimestamp()
        message.channel.send(LevelUp).then(msg => {
setTimeout(() => { msg.delete() }, 5000)
})
        
        const Level_Roles_Storage = fs.readFileSync('Storages/Level-Roles.json')
        const Level_Roles = JSON.parse(Level_Roles_Storage.toString())
        
        const Guild_Check = Level_Roles.find(guild => {
            return guild.guildID === `${message.guild.id}`
        })
        if(!Guild_Check) return;
    
        const Guild_Roles = Level_Roles.filter(guild => {
            return guild.guildID === `${message.guild.id}`
        })
        //For Loop Works for Checking
        for (let i = 0; i < Guild_Roles.length; i++) {
            const User = await Levels.fetch(message.author.id, message.guild.id);
            if(User.level == parseInt(Guild_Roles[i].Level_To_Reach)) {
                const AuthorID = message.guild.members.cache.get(message.author.id);
                const Given_Level_Role = Guild_Roles[i].Level_Role_ID
                
                return AuthorID.roles.add(Given_Level_Role)
                // .then(console.log('success'))
            }
        }
    }
})



// The message that we will get in terminal when we lunch the bot
Client.on("ready", async () => {
    console.log(`🤖 ${Client.user.username} is Online!`)
    function randomStatus() {
    let status = ["🤖 Wolfy Bot", "🤖 w!help", "🤖 Poob Beep"]
    let rstatus = Math.floor(Math.random() * status.length);

    Client.user.setActivity(status[rstatus], {type: "PLAYING"});
    }; setInterval(randomStatus, 5000)
})

Client.on("message", async message => {
    if (message.author == Client.user) return;
    if (message.channel.type === "dm") {
    const dmEmbed = new Discord.MessageEmbed()
    .setTitle('New DM')
    .setColor("738ADB")
    .setTimestamp()
    .setDescription(`**User:** ${message.author.tag}\n**User ID:** ${message.author.id}\n**At:** ${new Date()}\n\n**Content:** \`\`\`${message.content}\`\`\``)
    .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
    const DMC = Client.channels.cache.get('840892477614587914')
    DMC.send(dmEmbed)
}
if(message.channel.id === '859100693365653515') {
    if (message.author == Client.user)
    return;
    if (message.author.bot)
   return;
    message.channel.startTyping()
    fetch.default(`https://api.monkedev.com/fun/chat?msg=${message.content}&uid=${message.author.id}`)
    .then(res => res.json())
    .then(data => {
        message.lineReply(data.response, true);
        message.channel.stopTyping()
    })
    .catch(err => {
        message.lineReply(`Sorry, i can\'t reply this message!`, false);
        message.channel.stopTyping()
      })
}

    let UserData;
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
    if(UserData.blacklisted == true) return //message.channel.send("you're blacklisted")

    let prefix = config.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1)

    // it will make the cmd work with him orginal name and his aliases
    let commands = Client.commands.get(cmd.slice(prefix.length)) || Client.commands.get(Client.aliases.get(cmd.slice(prefix.length)));

    if(commands) commands.run(Client, message, args, prefix);
})

// Login To Discord with your app's Token

Client.login(process.env.token);
