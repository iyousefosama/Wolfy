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
        const bot = client.user.username;
        await client.channels.cache.get(config.debug)?.createWebhook(bot, {
            avatar: client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 128 })
          })
          const Debug = await client.channels.cache.get(config.debug)
          const botname = client.user.username;
          setTimeout(async function(){
          const webhooks = await Channel.fetchWebhooks()
          let webhook = webhooks.filter((w)=>w.type === "Incoming" && w.token).first();
          if(!webhook){
            webhook = await Debug.createWebhook(botname, {avatar: client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 128 })})
          }
          webhook.send({embeds: [bot]})
          .catch(() => {});
        }, 20000);
          // add more functions on ready  event callback function...
        
          return;
    }
}
}