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

const { passGen } = require("ultrax")

require('ultrax').inviteLogger(Client)

const Guard = require('discord.js-guard');

Client.on('messageReactionAdd', async (reaction, user) => {
    const handleStarboard = async () => {
        const SBChannel = Client.channels.cache.find(channel => channel.name.toLowerCase() === '🌟┃𝐒𝐭𝐚𝐫𝐛𝐨𝐚𝐫𝐝');
        const msgs = await SBChannel.messages.fetch({ limit: 100 });
        const SentMessage = msgs.find(msg => 
            msg.embeds.length === 1 ?
            (msg.embeds[0].footer.text.startsWith(reaction.message.id) ? true : false) : false);
        if(SentMessage) SentMessage.edit(`${reaction.count} - ⭐`);
        else {
            const embed = new Discord.MessageEmbed()
            .setAuthor(reaction.message.author.tag, reaction.message.author.displayAvatarURL())
            .setDescription(`**[Jump to the message](${reaction.message.url})**\n\n${reaction.message.content}\n`)
            .setColor('YELLOW')
            .setFooter(reaction.message.id)
            .setTimestamp();
            if(SBChannel)
            SBChannel.send('1 - ⭐', embed);
        }
    }
    if(reaction.emoji.name === '⭐') {
        if(reaction.message.channel.name.toLowerCase() === '🌟┃𝐒𝐭𝐚𝐫𝐛𝐨𝐚𝐫𝐝') return;
        if(reaction.message.partial) {
            await reaction.fetch();
            await reaction.message.fetch();
            handleStarboard();
        }
        else
        handleStarboard();
    }
});

Guard({ 
    whitelist: ["829819269806030879", "547905866255433758", "159985870458322944", "282859044593598464", "550613223733329920", "172002275412279296"],
    server_id: "828659000814862357",
    log_channel_id: "840892477614587914",
    slave_role:"858301783218192414",
    
    //1 active 0 deactive
    
    channel_create: 1, //When a channel is create on the server, it deletes that channel
    channel_delete: 1, //If a channel is deleted on the server, it clone that channel
    channel_update: 1, //When a channel is edited on the server, it restores that channel
    
    role_create: 1, //When a role is create on the server, it deletes that role
    role_delete: 1, //If a role is deleted on the server, it clone that role
    role_update: 1, //When a role is edited on the server, it restores that role
    
    emoji_create: 0, //When created an emoji deletes that emoji
    emoji_delete: 1, //When an emoji is deleted it that emoji create
    
    webhook_update: 0, //When the webhook is created it deletes the webhook
    
    guild_ban_add: 1, 
    guild_kick_add: 1,
    guild_member_role_update: 1, //Prevents administrative roles from being given to a user
    guild_bot_add: 1, //prevents malicious bots from join the server
    guild_update: 1,
    
    channel_create_log_message: '-user- created \`-channel-\` and deleted <a:pp681:774089750373597185>',
    channel_delete_log_message: '-user- deleted \`-channel-\` and restored <a:pp681:774089750373597185>',
    channel_update_log_message: '-user- updated \`-channel-\` and restored <a:pp681:774089750373597185>',
    
    role_create_log_message: '-user- created \`-role-\` <a:pp681:774089750373597185>',
    role_delete_log_message: '-user- deleted \`-role-\` <a:pp681:774089750373597185>',
    role_update_log_message: '-user- updated \`-role-\` <a:pp681:774089750373597185>',
    
    emoji_create_log_message: '-user- created \`-emoji-\` <a:pp681:774089750373597185>',
    emoji_delete_log_message: '-user- deleted \`-emoji-\` <a:pp681:774089750373597185>',
    
    webhook_update_log_message: '-user- updated \`-webhook-\` <a:pp681:774089750373597185>',

    guild_ban_add_log_message: '-user- banned \`-target-\` <a:pp681:774089750373597185>',
    guild_kick_add_log_message: '-user- kicked \`-target-\` <a:pp681:774089750373597185>',
    guild_member_role_update_log_message: '-user- given a role to user \`-role-\`',
    guild_bot_add_log_message: '-user- added a bot \`-bot-\` <a:pp681:774089750373597185>',
    guild_update_log_message: '-user- updated \`guild\` <a:pp681:774089750373597185>',
  
},Client);

Client.on('inviteJoin', async (member, invite, inviter) => {
    const channel = Client.channels.cache.get('830930561232273419')
    channel.send(`<a:CHECKCHECK:841321920456556554>${member} **Just joined,** invited by ${inviter}`)
})

Client.on('messageDelete', message => {
    if(message.author.bot) return;
    snipes.set(message.channel.id, message)

    const LogChannel = Client.channels.cache.get('831412872852013066')
    const DeletedLog = new Discord.MessageEmbed()
    .setTitle("Deleted Message")
    .setDescription(`**User:** ${message.author.tag}\n**User ID:** ${message.author.id}**\nIn: ${message.channel}**\n**At:** ${new Date()}\n\n**Content:** \`\`\`${message.content}\`\`\``)
    .setColor('RED')
    .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
    LogChannel.send(DeletedLog)
}) 
Client.on('messageUpdate', async(oldMessage, newMessage) => {
    if(oldMessage, newMessage.author.bot) return;
    if(message.author.bot) return;
    const LogChannel = Client.channels.cache.get('831412872852013066')
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
    if(message.author.bot) return;
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
    if(message.author.bot) return;
    fetch.default(`https://api.monkedev.com/fun/chat?msg=${message.content}&uid=${message.author.id}`)
    .then(res => res.json())
    .then(data => {
        message.channel.send(data.response)
    })
    .catch(err => {
        message.channel.send('<a:Error:836169051310260265> Sorry, i can\'t reply this message!');
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

Client.login(process.env.token)
