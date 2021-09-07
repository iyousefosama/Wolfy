const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    name: 'error',
    async execute(client, error) {

            const embed = new Discord.MessageEmbed()
            .setAuthor(client.user.username, client.user.displayAvatarURL({dynamic: true, size: 2048}))
            .setTitle(error.name)
            .setDescription(`\`\`\`${error.message}\`\`\``)
            .setFooter('Error!')
            .setTimestamp()
      
        const bot = client.user.username;
        await client.channels.cache.get(config.debug)?.createWebhook(bot, {
          avatar: client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 128 })
        })
        .then(webhook => Promise.all([webhook.send({ embeds: [embed] }), webhook]))
        .then(([_, webhook]) => webhook.delete())
        .catch(() => {});
      
        // add more functions on ready  event callback function...
      
        return;
    }
}