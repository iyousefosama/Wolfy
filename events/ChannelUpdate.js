const Discord = require('discord.js')
const { MessageEmbed } = require('discord.js')
const schema = require('../schema/GuildSchema')

module.exports = {
    name: 'channelUpdate',
    async execute(client, oldChannel, newChannel) {
        if (!oldChannel) {
            return;
          }

          let data;
          try{
              data = await schema.findOne({
                  GuildID: oldChannel.guild.id
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
          } else if(!Channel.guild.me.permissions.has("SEND_MESSAGES") || !Channel.guild.me.permissions.has("ADMINISTRATOR")) {
            return;
          } else {
            // Do nothing..
          };

          const fetchedLogs = await oldChannel.guild.fetchAuditLogs({
            limit: 1,
            type: 'CHANNEL_UPDATE',
        });
        // Since there's only 1 audit log entry in this collection, grab the first one
        const channelLog = fetchedLogs.entries.first();
      
        const { executor, type, id, name } = channelLog;
        const types = {
          GUILD_TEXT: "Text Channel",
          GUILD_VOICE: "Voice Channel",
          GUILD_CATEGORY: "CATEGORY",
          GUILD_NEWS: "News Channel",
          GUILD_STORE: "Store Channel",
          GUILD_NEWS_THREAD: "News Thread",
          GUILD_PUBLIC_THREAD: "Public Thread",
          GUILD_PRIVATE_THREAD: "Private Thread",
          GUILD_STAGE_VOICE: "Stage Voice"
      }
        if(!channelLog) {
          return;
        } else {
          //Do nothing..
        }

          let ChannelDeleted;
          if (oldChannel.name !== newChannel.name && oldChannel.type !== newChannel.type) {
            ChannelDeleted = new MessageEmbed()
            .setAuthor(executor.username, executor.displayAvatarURL({dynamic: true, size: 2048}))
            .setTitle('<a:Mod:853496185443319809> Channel Updated!')
            .setDescription(`<a:Right:860969895779893248> **Old Name:** ${oldChannel.name}\n<a:Right:860969895779893248> **New Name:** ${newChannel.name}\n<:pp198:853494893439352842> **Channel ID:** \`${oldChannel.id}\`\n\n<:Rules:853495279339569182> **ExecutorTag:** ${executor.tag}\n<:Tag:836168214525509653> **Old Type:** \`\`\`${types[oldChannel.type]}\`\`\`\n<:Tag:836168214525509653> **New Type:** \`\`\`${types[newChannel.type]}\`\`\``)
            .setColor('#ed7947')
            .setFooter(oldChannel.guild.name, oldChannel.guild.iconURL({dynamic: true}))
            .setTimestamp()
          } else if (oldChannel.name !== newChannel.name) {
            ChannelDeleted = new MessageEmbed()
            .setAuthor(executor.username, executor.displayAvatarURL({dynamic: true, size: 2048}))
            .setTitle('<a:Mod:853496185443319809> Channel Renamed!')
            .setDescription(`<a:Right:860969895779893248> **Old Name:** ${oldChannel.name}\n<a:Right:860969895779893248> **New Name:** ${newChannel.name}\n<:pp198:853494893439352842> **Channel ID:** \`${oldChannel.id}\`\n\n<:Rules:853495279339569182> **ExecutorTag:** ${executor.tag}\n<:Tag:836168214525509653> **ChannelType:** \`\`\`${types[newChannel.type]}\`\`\``)
            .setColor('#ed7947')
            .setFooter(oldChannel.guild.name, oldChannel.guild.iconURL({dynamic: true}))
            .setTimestamp()
          } else if (oldChannel.type !== newChannel.type) {
            ChannelDeleted = new MessageEmbed()
            .setAuthor(executor.username, executor.displayAvatarURL({dynamic: true, size: 2048}))
            .setTitle('<a:Mod:853496185443319809> ChannelType Updated!')
            .setDescription(`<a:Right:860969895779893248> **ChannelName:** ${newChannel.name}\n<:pp198:853494893439352842> **Channel ID:** \`${oldChannel.id}\`\n\n<:Rules:853495279339569182> **ExecutorTag:** ${executor.tag}\n<:Tag:836168214525509653> **Old Type:** \`\`\`${types[oldChannel.type]}\`\`\`\n<:Tag:836168214525509653> **New Type:** \`\`\`${types[newChannel.type]}\`\`\``)
            .setColor('#ed7947')
            .setFooter(oldChannel.guild.name, oldChannel.guild.iconURL({dynamic: true}))
            .setTimestamp()
          } else {
            // Do nothing..
          }
          
          const botname = client.user.username;
          const webhooks = await Channel.fetchWebhooks()
          setTimeout(async function(){
          let webhook = webhooks.filter((w)=>w.type === "Incoming" && w.token).first();
          if(!webhook){
            webhook = await Channel.createWebhook(botname, {avatar: client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 128 })})
          } else if(webhooks.size <= 10) {
            // Do no thing...
          }
          webhook.send({embeds: [ChannelDeleted]})
          .catch(() => {});
        }, 5000);
              // add more functions on ready  event callback function...
            
              return;
    }
}