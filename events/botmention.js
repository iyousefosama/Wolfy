const Discord = require('discord.js')
const schema = require('../schema/GuildSchema')
const config = require('../config.json')

module.exports = {
    name: 'messageCreate',
    async execute(client, message) {

        let data;
        let prefix;
        if (message.guild) {
        try{
            data = await schema.findOne({
                GuildID: message.guild.id
            })
        } catch(err) {
            console.log(err)
        }
    }
        if(!message.guild || message.author.bot) return;
        if (message.author == client.user) return;
        if (message.author.bot){
            return;
          };
          if (message.content.includes("@here") || message.content.includes("@everyone")) return;
          if (message.mentions.has(client.user)) {
            setTimeout(async function(){
            message.reply({ content: `<a:Right:877975111846731847> Hello **${message.author.username}**, my prefix is \`${config.prefix}\` my custom guild prefix \`${data.prefix || "None"}\` for the helplist \`${prefix}help\`!` })
        }, 900);
        }
    }
}