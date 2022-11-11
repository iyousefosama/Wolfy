const { MessageEmbed } = require('discord.js')
const schema = require('../schema/GuildSchema')
const uuid = require('uuid');
const warnSchema = require('../schema/Warning-Schema')

exports.badword = async function (client, message) {

    if(!message) {
        return;
    }

    if(!message.guild || message.author.bot) return;
    if (message.author == client.user) return;
    if (message.author.bot){
        return;
      };
      let data;
      if (message.guild) {
      try{
          data = await schema.findOne({
              GuildID: message.guild.id
          })
          if(!data) return;
      } catch(err) {
          console.log(err)
      }
  }
  const owner = await message.guild.fetchOwner()
 if (message.author.id === message.guild.ownerId) {
   return;
 } else if (message.channel?.permissionsFor(message.author).has("ADMINISTRATOR")) {
  return;
 } else if (!data || data.Mod.BadWordsFilter.BDW == null || data.Mod.BadWordsFilter.BDW.length == 0) {
    return;
  } else if(!data.Mod.BadWordsFilter.isEnabled || data.Mod.BadWordsFilter.isEnabled == false) {
    return;
  } else {
    // Do nothing..
  };

    if(data.Mod.BadWordsFilter.BDW.some(word => message.content.toLowerCase().includes(word))) {
        message.delete().then(msg => {
          setTimeout(async () => { 
            let reason = `Automoderator: This word is banned, watch your language.`
            const warnObj = {
              authorId: client.user.id,
              timestamp: Math.floor(Date.now() / 1000),
              warnId: uuid.v4(),
              reason: reason,
          };
  
          const warnAddData = await warnSchema.findOneAndUpdate(
              {
                  guildId: message.guild.id,
                  userId: message.author.id,
              },
              {
                  guildId: message.guild.id,
                  userId: message.author.id,
                  $push: {
                      warnings: warnObj,
                  },
              },
              {
                  upsert: true,
              },
          );
          const warnCount = warnAddData ? warnAddData.warnings.length + 1 : 1;
          const warnGrammar = warnCount === 1 ? '' : 's';
          if(warnCount >= 20) {
            return msg.channel.send({ content: `\\⚠️ **${message.author.username}**, This word is banned, watch your language.` })
          }
          
          const warnEmbed = new MessageEmbed()
          .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({dynamic: true, size: 2048}) })
          .setColor('#e6a54a')
          .setTitle(`⚠️ Warned **${message.author.username}**`)
          .setDescription(`• **Warn Reason:** ${reason}\n• **Warning${warnGrammar} Count:** ${warnCount}\n• **Warned By:** ${client.user.tag}`)
          .setFooter({ text: client.user.tag, iconURL: client.user.displayAvatarURL({dynamic: true, size: 2048}) })
          message.channel.send({ embeds: [warnEmbed] })
          const dmembed = new MessageEmbed()
          .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({dynamic: true, size: 2048}) })
          .setColor('#e6a54a')
          .setTitle(`⚠️ Warned **${message.author.username}**`)
          .setDescription(`• **Warn Reason:** ${reason}\n• **Warning${warnGrammar} Count:** ${warnCount}\n• **Warned By:** ${client.user.tag}`)
          .setFooter({ text: client.user.tag, iconURL: client.user.displayAvatarURL({dynamic: true, size: 2048}) })
            try {
              await user.send({ embeds: [dmembed] })
          } catch(error) {
              return;
          }
            msg.channel.send({ embeds: [warnEmbed] }).catch(() => null)
           }, 1000)
          })
    }
  };