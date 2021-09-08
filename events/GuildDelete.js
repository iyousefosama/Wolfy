const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    name: 'guildDelete',
    async execute(client, guild, guildDelete) {
        if (!guild || !guildDelete){
            return;
          };
            const left = new Discord.MessageEmbed()
            .setTitle(`${client.user.username} left a server!`)
            .setThumbnail(guild.iconURL({dynamic: true, format: 'png', size: 512}))
            .setColor("RED")
            .setDescription(`I left **${guild.name}**, with **${guild.memberCount}** members\n\nTotal servers: ${client.guilds.cache.size}\nTotal users: ${client.users.cache.size}`)
            .setDescription(`<a:pp224:853495450111967253> Server Name:\n\`\`\`${guild.name}\`\`\` \n<:pp833:853495153280155668> MembersCount:\n\`\`\`${guild.memberCount}\`\`\`\n\n<a:pp833:853495989796470815> Total servers: \`\`\`\n${client.guilds.cache.size}\`\`\`\n<a:pp833:853495989796470815> Total users: \n\`\`\`${client.users.cache.size}\`\`\``)
            .setTimestamp()
            const Debug = await client.channels.cache.get(config.debug)
            const botname = client.user.username;
            const webhooks = await Debug.fetchWebhooks()
            setTimeout(async function(){
            let webhook = webhooks.filter((w)=>w.type === "Incoming" && w.token).first();
            if(!webhook){
              webhook = await Debug.createWebhook(botname, {avatar: client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 128 })})
            }
            webhook.send({embeds: [left]})
            .catch(() => {});
          }, 5000);
            
              // add more functions on ready  event callback function...
            
              return;
    }
}