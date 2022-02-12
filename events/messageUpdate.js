const Discord = require('discord.js')
const schema = require('../schema/GuildSchema')

module.exports = {
    name: 'messageUpdate',
    async execute(client, oldMessage, messageUpdate) {
      if (oldMessage.channel.type === 'DM') return;
        if (oldMessage.author == client) return;
        if(!oldMessage.author) return;
        if(oldMessage.embeds[0]) return;
        if(oldMessage.attachments.size) return;
  if (oldMessage.author.bot){
    return;
  };

  let data;
  try{
      data = await schema.findOne({
          GuildID: oldMessage.guild.id
      })
      if(!data) return;
  } catch(err) {
      console.log(err)
  }
  let Channel = client.channels.cache.get(data.Mod.Logs.channel)
  if (!Channel || !data.Mod.Logs.channel){
    return;
  } else if (Channel.type !== 'GUILD_TEXT') {
    return;
  } else if (!data.Mod.Logs.isEnabled){
    return;
  } else if(!Channel.guild.me.permissions.has("EMBED_LINKS", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "VIEW_AUDIT_LOG", "SEND_MESSAGES")) {
    return;
  } else {
    // Do nothing..
  };

        const timestamp = Math.floor(Date.now() / 1000)
        const EditedLog = new Discord.MessageEmbed()
        .setAuthor({ name: oldMessage.author.username, iconURL: oldMessage.author.displayAvatarURL({dynamic: true, size: 2048}) })
        .setTitle(`📝 Edited Message`)
        .setDescription(`<a:iNFO:853495450111967253> **Member**: \`${oldMessage.author.tag}\` (${oldMessage.author.id})\n<:pp198:853494893439352842> **In**: ${oldMessage.channel}\n• **At**: <t:${timestamp}>\n\n<a:Right:877975111846731847> **Old Message**: \`\`\`\n${oldMessage.content || '❌ | Unkown message!'}\n\`\`\`\n<a:Right:877975111846731847> **New Message**: \`\`\`\n${messageUpdate.content || '❌ | Unkown message!'}\n\`\`\``)
        .setColor('#2F3136')
        .setFooter({ text: oldMessage.guild.name, iconURL: oldMessage.guild.iconURL({dynamic: true}) })
        .setTimestamp()
        .setThumbnail(oldMessage.author.displayAvatarURL({dynamic: true}))
          const botname = client.user.username;
          const webhooks = await Channel.fetchWebhooks()
          setTimeout(async function(){
          let webhook = webhooks.filter((w)=>w.type === "Incoming" && w.token).first();
          if(!webhook){
            webhook = await Channel.createWebhook(botname, {avatar: client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 128 })})
          } else if(webhooks.size <= 10) {
            // Do no thing...
          }
          webhook.send({embeds: [EditedLog]})
          .catch(() => {});
        }, 5000);
        
          // add more functions on ready  event callback function...
        
          return;
    }
} 
