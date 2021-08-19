const Discord = require('discord.js')
const Levels = require("discord-xp");
const fs = require('fs');

module.exports = {
    name: 'message',
    async execute(client, message) {
        if (message.channel.type === "dm") return;
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
    setTimeout(() => {
        if (msg.deleted) return;
        msg.delete()
     }, 5000)
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
    }
} 
