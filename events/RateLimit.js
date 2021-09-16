const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    name: 'rateLimit',
    async execute(client, info) {

      const warn = new Discord.MessageEmbed()
      .setAuthor(client.user.username, client.user.displayAvatarURL({dynamic: true, size: 2048}))
      .setTitle('RateLimit!')
      .setColor('RED')
      .setDescription(`<a:Error:836169051310260265> Rate limit hit ${info.timeDifference ? info.timeDifference : info.timeout ? info.timeout: 'Unknown timeout '}`)
      .setFooter(client.user.username, client.user.displayAvatarURL({dynamic: true}))
      .setTimestamp()
      const Debug = await client.channels.cache.get(config.debug)
      const botname = client.user.username;
      setTimeout(async function(){
        const webhooks = await Debug.fetchWebhooks()
        let webhook = webhooks.filter((w)=>w.type === "Incoming" && w.token).first();
        if(!webhook){
          webhook = await Debug.createWebhook(botname, {avatar: client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 128 })})
        }
        webhook.send({embeds: [warn]})
        .catch(() => {});
      }, 5000);
      
        // add more functions on ready  event callback function...
      
        return;
    }
}