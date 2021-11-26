const Discord = require('discord.js')
const schema = require('../schema/GuildSchema')
const config = require('../config.json')

module.exports = {
    name: 'messageCreate',
    async execute(client, message) {
        if(!message.guild || message.author.bot) return;
        if (message.author == client.user) return;
        if (message.author.bot){
            return;
          };
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
          const serverprefix = data?.prefix || 'Not set'
    
          if (message.content === 'prefix'){
            return message.channel.send(`**${message.author}**, My prefix is \`${config.prefix}\`, The custom prefix is \`${serverprefix}\`.`)
          } else {
            // Do nothing..
          };
      }
      if(message.channel.type === 'DM') {
        prefix = config.prefix;
      } else if (!data || data.prefix == null){
        prefix = config.prefix;
      } else if (data && data.prefix){
        prefix = data.prefix;
      } else {
        // Do nothing..
      };

      if (!prefix){
        return { executed: false, reason: 'PREFIX'};
      };
        if(message.content.startsWith(prefix)) {
        if(!message || !message.channel) return;
        console.log(`${message.author.tag}|(${message.author.id}) in #${message.channel.name}|(${message.channel.id}) sent: ${message.content}`)
        } else {
          //Do nothing..
        }
    }
}