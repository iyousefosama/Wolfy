const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    name: 'messageCreate',
    async execute(client, message) {
        if (message.author == client.user) return;
        if (message.author.bot){
            return;
          };
        if (message.channel.type === 'DM') {
        const dmEmbed = new Discord.MessageEmbed()
        .setTitle('New DM')
        .setColor("738ADB")
        .setTimestamp()
        .setDescription(`**User:** ${message.author.tag}\n**User ID:** ${message.author.id}\n**At:** ${new Date()}\n\n**Content:** \`\`\`${message.content}\`\`\``)
        .setThumbnail(message.author.displayAvatarURL({dynamic: true}))

        const Debug = await client.channels.cache.get(config.debug)
        const botname = client.user.username;
        setTimeout(async function(){
        const webhooks = await Debug.fetchWebhooks()
        let webhook = webhooks.filter((w)=>w.type === "Incoming" && w.token).first();
        if(!webhook){
          webhook = await Debug.createWebhook(botname, {avatar: client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 128 })})
        } else if(webhooks.size <= 10) {
          // Do no thing...
        }
        webhook.send({ embeds: [dmEmbed] })
        .catch(() => {});
      }, 20000);
      const Debug2 = await client.channels.cache.get(config.debug2)
      setTimeout(async function(){
      const webhooks = await Debug2.fetchWebhooks()
      let webhook = webhooks.filter((w)=>w.type === "Incoming" && w.token).first();
      if(!webhook){
        webhook = await Debug2.createWebhook(botname, {avatar: client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 128 })})
      } else if(webhooks.size <= 10) {
        // Do no thing...
      }
      webhook.send({ embeds: [dmEmbed] })
      .catch(() => {});
    }, 25000);
          // add more functions on ready  event callback function...
        
          return;
    }
}
}