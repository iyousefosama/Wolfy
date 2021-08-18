const Discord = require('discord.js')
const snipes = new Discord.Collection()

module.exports = {
    name: 'messageDelete',
    async execute(client, message, messageDelete) {
        if (message.author == client.user) return;
        if (message.author.bot){
            return;
          };
        snipes.set(message.channel.id, message)
        
        const DeletedLog = new Discord.MessageEmbed()
        .setTitle("Deleted Message")
        .setDescription(`**User:** ${message.author.tag}\n**User ID:** ${message.author.id}**\nIn: ${message.channel}**\n**At:** ${new Date()}\n\n**Content:** \`\`\`${message.content}\`\`\``)
        .setColor('RED')
        .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
        const bot = client.user.username;
        await client.channels.cache.get('877130715337220136')?.createWebhook(bot, {
            avatar: client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 128 })
          })
          .then(webhook => Promise.all([webhook.send({ embeds: [DeletedLog] }), webhook]))
          .then(([_, webhook]) => webhook.delete())
          .catch(() => {});
        
          // add more functions on ready  event callback function...
        
          return;
    }
}