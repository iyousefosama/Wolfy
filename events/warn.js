const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    name: 'warn',
    async execute(client, info) {

            const warn = new Discord.MessageEmbed()
            .setAuthor(client.user.username, client.user.displayAvatarURL({dynamic: true, size: 2048}))
            .setTitle('The Client got a general warn!')
            .setColor('RED')
            .setDescription(`\`\`\`${info}\`\`\``)
            .setFooter(client.user.username, client.user.displayAvatarURL({dynamic: true}))
            .setTimestamp()
      
            const Debug = await client.channels.cache.get(config.debug)
            const botname = client.user.username;
            setTimeout(async function(){
            const webhooks = await Debug.fetchWebhooks()
            if(webhooks.size = 10) return;
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