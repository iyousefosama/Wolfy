const discord = require('discord.js')

module.exports = {
    name: 'guildDelete',
    async execute(client, guild) {
        if (!guild || !guild.available){
            return;
          } else {
            // do nothing..
          }
            const left = new discord.EmbedBuilder()
            .setTitle(`${client.user.username} left a server!`)
            .setThumbnail(guild.iconURL({dynamic: true, extension:'png', size: 512}))
            .setColor("Red")
            .setDescription(`<a:pp224:853495450111967253> Server Name:\n\`\`\`${guild.name} (${guild.id})\`\`\` \n<:pp833:853495153280155668> MembersCount:\n\`\`\`${guild.memberCount}\`\`\`\n\n<a:pp833:853495989796470815> Total servers: \`\`\`\n${client.guilds.cache.size}\`\`\`\n<a:pp833:853495989796470815> Total users: \n\`\`\`${client.users.cache.size}\`\`\``)
            .setTimestamp()
            const Debug = await client.channels.cache.get(client.config.channels.debug)
            const botname = client.user.username;
            setTimeout(async function(){
            const webhooks = await Debug.fetchWebhooks()
            let webhook = webhooks.filter((w)=>w.token).first();
            if(!webhook){
              webhook = await Debug.createWebhook({ name: botname, avatar: client.user.displayAvatarURL({ extension:'png', dynamic: true, size: 128 })})
            } else if(webhooks.size <= 10) {
              // Do no thing...
            }
            webhook.send({ embeds: [left] })
            .catch(() => {});
          }, 5000);
            
              // add more functions on ready  event callback function...
            
              return;
    }
}