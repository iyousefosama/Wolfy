const Discord = require('discord.js')
const { MessageEmbed } = require('discord.js')
const schema = require('../schema/GuildSchema')
let logs = [];

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
          } else if(!Channel.guild.me.permissions.has("EMBED_LINKS", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "VIEW_AUDIT_LOG", "SEND_MESSAGES")) {
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

        if(!channelLog) {
          return;
        } else {
          //Do nothing..
        }
      
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
        if(!channelLog.available && id != oldChannel.id) {
          return;
        } else {
          //Do nothing..
        }

          let ChannelUpdate;
          if (oldChannel.name !== newChannel.name && oldChannel.type !== newChannel.type) {
            ChannelUpdate = new MessageEmbed()
            .setAuthor({ name: executor.username, iconURL: executor.displayAvatarURL({dynamic: true, size: 2048}) })
            .setTitle('<a:Mod:853496185443319809> Channel Updated!')
            .setDescription(`<a:Right:860969895779893248> **Old Name:** ${oldChannel.name}\n<a:Right:860969895779893248> **New Name:** ${newChannel.name}\n<:pp198:853494893439352842> **Channel ID:** \`${oldChannel.id}\`\n\n<:Rules:853495279339569182> **ExecutorTag:** ${executor.tag}\n<:Tag:836168214525509653> **Old Type:** \`\`\`${types[oldChannel.type]}\`\`\`\n<:Tag:836168214525509653> **New Type:** \`\`\`${types[newChannel.type]}\`\`\``)
            .setColor('#e6a54a')
            .setFooter({ text: oldChannel.guild.name, iconURL: oldChannel.guild.iconURL({dynamic: true}) })
            .setTimestamp()
          } else if (oldChannel.name !== newChannel.name) {
            ChannelUpdate = new MessageEmbed()
            .setAuthor({ name: executor.username, iconURL: executor.displayAvatarURL({dynamic: true, size: 2048}) })
            .setTitle('<a:Mod:853496185443319809> Channel Renamed!')
            .setDescription(`<a:Right:860969895779893248> **Old Name:** ${oldChannel.name}\n<a:Right:860969895779893248> **New Name:** ${newChannel.name}\n<:pp198:853494893439352842> **Channel ID:** \`${oldChannel.id}\`\n\n<:Rules:853495279339569182> **ExecutorTag:** ${executor.tag}\n<:Tag:836168214525509653> **ChannelType:** \`\`\`${types[newChannel.type]}\`\`\``)
            .setColor('#e6a54a')
            .setFooter({ text: oldChannel.guild.name, iconURL: oldChannel.guild.iconURL({dynamic: true}) })
            .setTimestamp()
          } else if (oldChannel.type !== newChannel.type) {
            ChannelUpdate = new MessageEmbed()
            .setAuthor({ name: executor.username, iconURL: executor.displayAvatarURL({dynamic: true, size: 2048}) })
            .setTitle('<a:Mod:853496185443319809> ChannelType Updated!')
            .setDescription(`<a:Right:860969895779893248> **ChannelName:** ${newChannel.name}\n<:pp198:853494893439352842> **Channel ID:** \`${oldChannel.id}\`\n\n<:Rules:853495279339569182> **ExecutorTag:** ${executor.tag}\n<:Tag:836168214525509653> **Old Type:** \`\`\`${types[oldChannel.type]}\`\`\`\n<:Tag:836168214525509653> **New Type:** \`\`\`${types[newChannel.type]}\`\`\``)
            .setColor('#e6a54a')
            .setFooter({ text: oldChannel.guild.name, iconURL: oldChannel.guild.iconURL({dynamic: true}) })
            .setTimestamp()
          } else {
            // Do nothing..
          }
          
          const botname = client.user.username;
          const webhooks = await Channel.fetchWebhooks()
          logs.push(ChannelUpdate)
          setTimeout(async function(){
          let webhook = webhooks.filter((w)=>w.type === "Incoming" && w.token).first();
          if(!webhook){
            webhook = await Channel.createWebhook(botname, {avatar: client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 128 })})
          } else if(webhooks.size <= 10) {
            // Do no thing...
          }
          webhook.send({embeds: logs.slice(0, 10).map(log => log)})
          .catch(() => {})
          logs = [];
        }, 5000);
              // add more functions on ready  event callback function...
            
              return;
    }
}