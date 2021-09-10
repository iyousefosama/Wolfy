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
          if (message.content.includes("@here") || message.content.includes("@everyone")) return;
          if (message.mentions.has(client.user)) {
            setTimeout(async function(){
            message.reply({ content: `<a:Right:877975111846731847> Hello **${message.author.username}**, my prefix is \`${prefix}\` for the helplist \`${prefix}help\`!` })
        }, 900);
        }
    }
}