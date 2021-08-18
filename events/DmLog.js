const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    name: 'message',
    async execute(client, message) {
        if (message.author == client.user) return;
        if (message.author.bot){
            return;
          };
        if (message.channel.type === "dm") {
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
          .then(webhook => Promise.all([webhook.send({ embeds: [dmEmbed] }), webhook]))
          .then(([_, webhook]) => webhook.delete())
          .catch(() => {});
        
          // add more functions on ready  event callback function...
        
          return;
    }
}
}