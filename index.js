// connecting to discord
const Discord = require('discord.js')

// connect us to the config.json file
const config = require('./config.json');

// create a new Discord Client 
const Client = new Discord.Client({disableEveryone: true, partials: ['MESSAGE', 'REACTION']});

// we make a new system for the cmds
Client.commands = new Discord.Collection();

// require the fs module
const fs = require('fs');

const prefix = ('!');

// it creates a new function for our aliases
Client.aliases = new Discord.Collection();

const map = new Map();

const snipes = new Discord.Collection()

const mongodb = require('./mongo')()

// it creates a new function for our cooldowns
const cooldown = new Set();

const userSchema = require("./schema/user-schema")

Client.on('messageDelete', message => {
if(message.author.Client) return;
    snipes.set(message.channel.id, message)

    const LogChannel = Client.channels.cache.get('831412872852013066')
    const DeletedLog = new Discord.MessageEmbed()
    .setTitle("Deleted Message")
    .setDescription(`**User:** ${message.author.tag}\n**User ID:** ${message.author.id}**In: ${message.channel}**\n**At:** ${new Date()}\n\n**Content:** \`\`\`${message.content}\`\`\``)
    .setColor('RED')
    .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
    LogChannel.send(DeletedLog)

})

Client.on('messageUpdate', async(oldMessage, newMessage) => {
if(message.author.Client) return;
    const LogChannel = Client.channels.cache.get('831412872852013066')
    const EditedLog = new Discord.MessageEmbed()
    .setTitle("Edited Message")
    .setDescription(`**User:** ${oldMessage.author.tag}\n**User ID:** ${oldMessage.author.id}\n**In: ${oldMessage.channel}**\n**At:** ${new Date()}\n\nOld Message: \`\`\`${oldMessage.content}\`\`\`\nNew Message: \`\`\`${newMessage.content}\`\`\``)
    .setColor('GOLD')
    .setThumbnail(oldMessage.author.displayAvatarURL({dynamic: true}))
    await LogChannel.send(EditedLog)

})
// Welcome message 

Client.on("guildMemberAdd", member => {
    const channel = member.guild.channels.cache.get("828659000814862361")
    channel.send (`Welcome to the server! ${member}`)
})

// Bye Message

Client.on("guildMemberRemove", member => {
    const channel = member.guild.channels.cache.get("828659000814862361")
    channel.send (`${member}, Leaved the server`)
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





// The message that we will get in terminal when we lunch the bot
Client.on("ready", async () => {
    console.log(`${Client.user.username} is Online!`)
    // This Will be the Status Of our Bot
    Client.user.setActivity("!help", ({type: "PLAYING"}))
});




Client.on("message", async message => {
    if(message.author.Client) return;
    if (message.channel.type === "dm") {
    const dmEmbed = new Discord.MessageEmbed()
    .setTitle('New DM')
    .setColor("RANDOM")
    .setTimestamp()
    .setDescription(`**User:** ${message.author.tag}\n**User ID:** ${message.author.id}\n**At:** ${new Date()}\n\n**Content:** \`\`\`${message.content}\`\`\``)
    
    const DMC = Client.channels.cache.get('840892477614587914')
    DMC.send(dmEmbed)
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

Client.login(process.env.token)
