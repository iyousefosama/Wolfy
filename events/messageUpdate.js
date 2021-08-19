const Discord = require('discord.js')
const snipes = new Discord.Collection()
const config = require('../config.json')

module.exports = {
    name: 'messageUpdate',
    async execute(client, oldMessage, messageUpdate) {
        if (oldMessage.author.client) return;
        snipes.set(oldMessage.channel.id, oldMessage)

        if(!oldMessage.author) return;
        const EditedLog = new Discord.MessageEmbed()
        .setTitle("Edited Message")
        .setDescription(`**User:** ${oldMessage.author.tag}\n**User ID:** ${oldMessage.author.id}\n**In: ${oldMessage.channel}**\n**At:** ${new Date()}\n\nOld Message: \`\`\`${oldMessage.content}\`\`\`\nNew Message: \`\`\`${messageUpdate.content}\`\`\``)
        .setColor('GOLD')
        .setThumbnail(oldMessage.author.displayAvatarURL({dynamic: true}))
        const botname = client.user.username;
        await oldMessage.guild.channels.cache.get(config.log)?.createWebhook(botname, {
            avatar: client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 128 })
          })
          .then(webhook => Promise.all([webhook.send({ embeds: [EditedLog] }), webhook]))
          .then(([_, webhook]) => webhook.delete())
          .catch(() => {});
        
          // add more functions on ready  event callback function...
        
          return;
    }
} 
