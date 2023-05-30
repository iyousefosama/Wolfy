const discord = require('discord.js')

module.exports = {
    name: 'guildCreate',
    async execute(client, guild) {
      if (!guild || !guild.available){
        return;
      } else {
        // return nothing..
      }
      
        const join = new discord.EmbedBuilder()
        .setTitle(`${client.user.username} added to a new server!`)
        .setColor("Green")
        .setThumbnail(guild.iconURL({dynamic: true, extension:'png', size: 512}))
        .setDescription(`<a:pp224:853495450111967253> Server Name:\n\`\`\`${guild.name} (${guild.id})\`\`\` \n<:pp833:853495153280155668> MembersCount:\n\`\`\`${guild.memberCount}\`\`\`\n\n<a:pp330:853495519455215627> Total servers: \`\`\`\n${client.guilds.cache.size}\`\`\`\n<a:pp330:853495519455215627> Total users: \n\`\`\`${client.users.cache.size}\`\`\``)
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
        webhook.send({ embeds: [join] })
        .catch(() => {});
      }, 10000);
        
          // add more functions on ready  event callback function...
        
          return;
    }
}