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
        try {
          const logchannel = await client.channels.cache.get(config.debug)
          const webhooks = await logchannel.fetchWebhooks();
          const webhook = webhooks.first();
      
          await webhook.send({
            embeds: [dmEmbed],
            username: bot,
            avatarURL: client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 128 })
          });
        } catch(error) {
        await client.channels.cache.get(config.debug)?.createWebhook(bot, {
            avatar: client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 128 })
          })
          .then(webhook => Promise.all([webhook.send({ embeds: [dmEmbed] }), webhook]))
        }
          // add more functions on ready  event callback function...
        
          return;
    }
}
}