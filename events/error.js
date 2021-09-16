const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    name: 'error',
    async execute(client, error) {

            const embed = new Discord.MessageEmbed()
            .setAuthor(client.user.username, client.user.displayAvatarURL({dynamic: true, size: 2048}))
            .setTitle(error.name)
            .setDescription(`\`\`\`${error}\`\`\``)
            .setFooter('Error!')
            .setColor('RED')
            .setTimestamp()
      
            const Debug = await client.channels.cache.get(config.debug)
            const botname = client.user.username;
            setTimeout(async function(){
              const webhooks = await Debug.fetchWebhooks()
              if(webhooks.size = 10) return;
              let webhook = webhooks.filter((w)=>w.type === "Incoming" && w.token).first();
              if(!webhook){
                webhook = await Debug.createWebhook(botname, {avatar: client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 128 })})
              } else if(webhooks.size <= 10) {
                // Do no thing...
              }
              webhook.send({embeds: [embed]})
              .catch(() => {});
            }, 5000);;
      
        // add more functions on ready  event callback function...
      
        return;
    }
}