const Discord = require('discord.js')
const { prefix } = require('.././config.json');

module.exports = {
    name: 'message',
    execute(client, message) {
        if(!message.guild || message.author.bot) return;
        if(!message.content.startsWith(prefix)) return
        console.log(`${message.author.tag} in #${message.channel.name} sent: ${message.content}`);
    }
}