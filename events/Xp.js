const Discord = require('discord.js')
const Levels = require("discord-xp");
const fs = require('fs');
const schema = require('../schema/GuildSchema')

module.exports = {
    name: 'messageCreate',
    async execute(client, message) {
        if (message.channel.type === "DM") return;
        if (message.guild){
            if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')){
              return { executed: false, reason: 'PERMISSION_SEND'};
            } else {
              // Do nothing..
            };
          };
        if (message.author == client.user) return;
        if (message.author.bot){
            return;
          };
        
          let data;
          try{
              data = await schema.findOne({
                  GuildID: message.guild.id
              })
              if(!data) {
                  data = await schema.create({
                      GuildID: message.guild.id
                  })
              }
          } catch(err) {
              console.log(err)
              message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`)
          }
          if(!data.Mod.Level.isEnabled) return;
    
        const randomXp = Math.floor(Math.random() * 46) + 1;
        const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, randomXp);
    
        if(hasLeveledUp) {
            const User = await Levels.fetch(message.author.id, message.guild.id);
    
            const LevelUp = new Discord.MessageEmbed()
            .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({dynamic: true, size: 2048})})
            .setDescription(`${message.author}, You have leveled up to level **${User.level}!** <a:pp330:853495519455215627>`)
            .setColor('DARK_GREEN')
            .setTimestamp()
            message.channel.send({ embeds: [LevelUp] }).then(msg => {
    setTimeout(() => {
        msg.delete().catch(() => null)
     }, 5000)
    })
            
            const Level_Roles_Storage = fs.readFileSync('./assets/json/Level-Roles.json')
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
                    
                    return AuthorID.roles.add(Given_Level_Role).catch(err => message.reply(`<a:Wrong:812104211361693696> **|** There was an error while trying to give the level role to the user!\n\`Please Check my role position!\``));
                    // .then(console.log('success'))
                }
            }
        }
    }
} 