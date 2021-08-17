const Discord = require('discord.js')

module.exports = {
    name: 'message',
    execute(client, message) {
        if(!message.guild || message.author.bot) return;
        const prefix = client.config.prefix;
        if(!message.content.startsWith(prefix)) return
        console.log(`${message.author.tag} in #${message.channel.name} sent: ${message.content}`);
    }
}