const Discord = require('discord.js')
const { prefix } = require('.././config.json');

module.exports = {
    name: 'messageCreate',
    execute(client, message) {
        if(!message.guild || message.author.bot) return;
        if (message.author == client.user) return;
        if (message.author.bot){
            return;
          };
        if(!message.content.startsWith(prefix)) return
        console.log(`${message.author.tag}|(${message.author.id}) in #${message.channel.name}|(${message.channel.id}) sent: ${message.content}`);
    }
}