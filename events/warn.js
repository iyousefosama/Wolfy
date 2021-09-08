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
      
        const bot = client.user.username;
        await client.channels.cache.get(config.debug)?.createWebhook(bot, {
          avatar: client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 128 })
        })
        .then(webhook => Promise.all([webhook.send({ embeds: [warn] }), webhook]))
        .then(([_, webhook]) => webhook.delete())
        .catch(() => {});
      
        // add more functions on ready  event callback function...
      
        return;
    }
}