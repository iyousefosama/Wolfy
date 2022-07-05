const Discord = require('discord.js')
const { Collection } = require('discord.js')
const text = require('../util/string');
const userSchema = require('../schema/user-schema')
const schema = require('../schema/GuildSchema')
const { developer } = require('../config.json');
const config = require('../config.json')
const cooldowns = new Collection();

module.exports = {
    name: 'messageCreate',
    async execute(client, message) {
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
              message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`)
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

      if(message.author.bot || !message.content.startsWith(prefix)) return;
      const args = message.content.slice(prefix.length).split(/ +/g);
      if (!args.length) return message.channel.send({ content: `You didn't pass any command to reload, ${message.author}!`});
      const commandName = args.shift().toLowerCase();
  
      const cmd = client.commands.get(commandName)
          //+ aliases: [""],
          || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))
  
          if(commandName.length < 1) return { executed: false, reason: 'NOT_FOUND' };
          if (!cmd) return message.channel.send({ content: `\\❌ | ${message.author}, There is no command with name or alias \`${commandName}\`!`}), { executed: false, reason: 'NOT_FOUND' };
          
                  //+ Blacklisted
                  try {
                      UserData = await userSchema.findOne({
                          userId: message.author.id
                      })
                  } catch (error) {
                      console.log(error)
                      message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`)
                  }
                  if(UserData?.Status.Blacklisted.current == true) return message.channel.send({ content: `\`\`\`diff\n- You are blacklisted from using the bot!\n\n+ Reason: ${UserData.Status.Blacklisted.reason}\`\`\``})
  
          try{
  
  
              //+ args: true/false,
          if (cmd.args && !args.length) {
              let desc = `You didn't provide any arguments`;
  
              //+ usage: '<> <>',
              if (cmd.usage) {
                  desc += `, The proper usage would be:\n\`${prefix}${cmd.name} ${cmd.usage}\``;
              }
              if (cmd.examples && cmd.examples.length !== 0) {
                  desc += `\n\nExamples:\n${cmd.examples.map(x=>`\`${prefix}${cmd.name} ${x}\n\``).join(' ')}`;
              }
      
              const NoArgs = new Discord.MessageEmbed()
              .setDescription(desc)
              .setColor('RED')
              return message.channel.send({ embeds: [NoArgs] });
          }
  
              //+ cooldown 1, //seconds(s)
              if (!cooldowns.has(cmd.name)) {
                  cooldowns.set(cmd.name, new Discord.Collection());
              }
              
              const now = Date.now();
              const timestamps = cooldowns.get(cmd.name);
              const cooldownAmount = (cmd.cooldown || 3) * 1000;
              
              if (timestamps.has(message.author.id)) {
                  const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
              
                  if (now < expirationTime) {
                      const timeLeft = (expirationTime - now) / 1000;
                      return message.channel.send({ content: ` **${message.author.username}**, please cool down! (**${timeLeft.toFixed(0)}** second(s) left)`}).then(msg => {
                          setTimeout(() => {
                              msg.delete().catch(() => null)
                           }, 3000)
                          })
                  }
              }
              timestamps.set(message.author.id, now);
              setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
                   
                   //+ permissions: [""],
                   if (cmd.permissions) {
                       if (message.guild && message.author.id !== developer) {
                         const authorPerms = message.channel.permissionsFor(message.author);
                         if (!authorPerms || !authorPerms.has(cmd.permissions)) {
                              const PermsEmbed = new Discord.MessageEmbed()
                              .setColor(`RED`)
                              .setDescription(`<a:pp802:768864899543466006> You don't have \`${text.joinArray(cmd.permissions)}\` permission(s) to use ${cmd.name} command.`)
                              return message.channel.send({ embeds: [PermsEmbed] })
                           }
                        }
                       }
  
                   //+ clientpermissions: [""],
                   if (cmd.clientpermissions) {
                      if (message.guild) {
                      const clientPerms = message.channel.permissionsFor(message.guild.me);
                      if (!clientPerms || !clientPerms.has(cmd.clientpermissions)) {
                          const ClientPermsEmbed = new Discord.MessageEmbed()
                          .setColor(`RED`)
                          .setDescription(`<a:pp802:768864899543466006> The bot is missing \`${text.joinArray(cmd.clientpermissions)}\` permission(s)`)
                          return message.channel.send({ embeds: [ClientPermsEmbed] })
                      }
                     }
                  }
  
                  //+ guildOnly: true/false,
                  if (cmd.guildOnly && message.channel.type === 'DM') {
                      const NoDmEmbed = new Discord.MessageEmbed()
                      .setColor(`RED`)
                      .setDescription(`<a:pp802:768864899543466006> I can\'t execute that command inside DMs!`)
                      return message.reply({ embeds: [NoDmEmbed] })
                  }
  
                  //+ dmOnly: true/false,
                  if (cmd.dmOnly && message.channel.type === 'GUILD_TEXT') {
                      const NoGuildEmbed = new Discord.MessageEmbed()
                      .setColor(`RED`)
                      .setDescription(`<a:pp802:768864899543466006> I can\'t execute that command inside the server!`)
                      return message.channel.send({ embeds: [NoGuildEmbed] })
                  }
  
                  if(cmd.guarded) {
                      const GuardedEmbed = new Discord.MessageEmbed()
                      .setColor(`RED`)
                      .setDescription(`<a:pp802:768864899543466006> \`${cmd.name}\` is guarded!`)
                      return message.channel.send({ embeds: [GuardedEmbed] })
                  }
  
                  if(cmd.OwnerOnly) {
                      if(message.author.id !== developer) {
                          const DevOnlyEmbed = new Discord.MessageEmbed()
                          .setColor(`RED`)
                          .setDescription(`<a:pp802:768864899543466006> **${message.author.username}**, the command \`${cmd.name}\` is limited for developers only!`)
                          return message.channel.send({ embeds: [DevOnlyEmbed] })
  
                      }
                  }
  
                  if (message.guild){
                      if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')){
                        return { executed: false, reason: 'PERMISSION_SEND'};
                      } else {
                        // Do nothing..
                      };
                    };
                    if (message.guild){
                      if (!message.channel.permissionsFor(message.guild.me).has('VIEW_CHANNEL')){
                        return;
                      } else {
                        // Do nothing..
                      };
                    };
                    if (message.guild){
                      if (!message.channel.permissionsFor(message.guild.me).has('READ_MESSAGE_HISTORY')){
                        return message.channel.send({ content: '"Missing Access", the bot is missing the \`READ_MESSAGE_HISTORY\` permission please enable it!'})
                      } else {
                        // Do nothing..
                      };
                    };  
          console.log(`${message.author.tag}|(${message.author.id}) in #${message.channel.name}|(${message.channel.id}) sent: ${message.content}`)
          cmd.execute(client, message, args, { executed: true });
      } catch(err){
          message.reply(`<a:Settings:841321893750505533> There was an error in the console.\n\`Please report this with a screenshot to WOLF#1045\``);
          console.log(err);
      }
    }
}