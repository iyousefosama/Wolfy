const Discord = require('discord.js')
let logs = [];

module.exports = {
    name: 'rateLimit',
    async execute(client, info) {
      if (!info){
        return;
      };
      if(!client.config.channels.debug) {
        return;
      } else {
        // Do nothing..
      }

      const ratelimit = new Discord.MessageEmbed()
      .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({dynamic: true, size: 2048}) })
      .setColor('RED')
      .setDescription(`\`\`\`js\nRate limit hit ${info.timeDifference ? info.timeDifference : info.timeout ? info.timeout: 'Unknown timeout '}\`\`\``)
      .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({dynamic: true}) })
      .setTimestamp()
      const Debug = await client.channels.cache.get(client.config.channels.debug)
      const botname = client.user.username;
      logs.push(ratelimit)
      setTimeout(async function(){
      const webhooks = await Debug.fetchWebhooks()
      let webhook = webhooks.filter((w)=>w.type === "Incoming" && w.token).first();
      if(!webhook){
        webhook = await Debug.createWebhook(botname, {avatar: client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 128 })})
      } else if(webhooks.size <= 10) {
        // Do no thing...
      }
      webhook.send({embeds: logs.slice(0, 10).map(log => log)})
      .catch(() => {})
      logs = []
    }, 5000);
      
        // add more functions on ready  event callback function...
      
        return;
    }
}