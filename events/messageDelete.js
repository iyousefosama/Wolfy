const Discord = require('discord.js')
const snipes = new Discord.Collection()
const config = require('../config.json')

module.exports = {
    name: 'messageDelete',
    async execute(client, message, messageDelete) {
        if (messageDelete.client) return;
        snipes.set(message.channel.id, message)
        
        if (!message.author) return;
        const DeletedLog = new Discord.MessageEmbed()
        .setTitle("Deleted Message")
        .setDescription(`**User:** ${message.author.tag}\n**User ID:** ${message.author.id}**\nIn: ${message.channel}**\n**At:** ${new Date()}\n\n**Content:** \`\`\`${message.content}\`\`\``)
        .setColor('RED')
        .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
        const botname = client.user.username;
        await message.guild.channels.cache.get(config.log)?.createWebhook(botname, {
            avatar: client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 128 })
          })
          .then(webhook => Promise.all([webhook.send({ embeds: [DeletedLog] }), webhook]))
          .then(([_, webhook]) => webhook.delete())
          .catch(() => {});
        
          // add more functions on ready  event callback function...
        
          return;
    }
}
