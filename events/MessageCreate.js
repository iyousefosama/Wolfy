const Discord = require('discord.js')
const schema = require('../schema/GuildSchema')
const GUUCSchema = require('../schema/GUUC-Schema')
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
    
          if (message.content.toLowerCase() === 'prefix'){
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
    const now = Date.now();
    const duration = Math.floor(3000)
    const UsedCommandsWarnsResetduration = Math.floor(57600000)
    const GlobalWarnsResetResetduration = Math.floor(86400000)
    let Guucdata;
    try{
      Guucdata = await GUUCSchema.findOne({
        userID: message.author.id
        })
        if(!Guucdata) {
          Guucdata = await GUUCSchema.create({
            userID: message.author.id
            })
        }
    } catch(err) {
        console.log(err)
    }
    if(Guucdata.Status.SilentBlacklist.current === true) return;
    const msgObj = {
      timestamp: Math.floor(Date.now() / 1000),
      message: `${message.author.tag} in #${message.channel.name}|(${message.channel.id})|g: ${message.guild.id} sent: ${message.content}`,
  };
    const msgAddData = await GUUCSchema.findOneAndUpdate(
      {
        userID: message.author.id,
      },
      {
        userID: message.author.id,
        timeoutReset: Date.now() + duration,
          $push: {
             UsedCommandsInv: msgObj,
          },
      },
      {
          upsert: true,
      },
  );

  if (Guucdata.timeoutReset > now && Guucdata.UsedCommandsWarn !== 25 && Guucdata.GlobalWarns !== 3) {
    Guucdata.UsedCommandsWarn += Math.floor(1);
    Guucdata.UsedCommandsWarnsReset = Date.now() + UsedCommandsWarnsResetduration;
    await Guucdata.save()
  } else if(Guucdata.UsedCommandsWarnsReset < now) {
    Guucdata.UsedCommandsWarn = Math.floor(0);
    await Guucdata.save()
  } else if(Guucdata.UsedCommandsWarn === 25 && Guucdata.GlobalWarns !== 3) {
    Guucdata.GlobalWarns += Math.floor(1);
    Guucdata.UsedCommandsWarn = Math.floor(0);
    Guucdata.GlobalWarnsReset = Date.now() + GlobalWarnsResetResetduration;
    await Guucdata.save()
  } else if(Guucdata.GlobalWarnsReset < now) {
    Guucdata.GlobalWarns = Math.floor(0);
    await Guucdata.save()
  } else if(Guucdata.GlobalWarns === 3) {
    Guucdata.Status.SilentBlacklist.current = true
    Guucdata.Status.SilentBlacklist.reason = `Wolfy: SelfBot, spamming commands!`
    await Guucdata.save()
  }
        if(message.content.startsWith(prefix)) {
        if(!message || !message.channel) return;
        console.log(`${message.author.tag}|(${message.author.id}) in #${message.channel.name}|(${message.channel.id}) sent: ${message.content}`)
        } else {

        }
    }
}