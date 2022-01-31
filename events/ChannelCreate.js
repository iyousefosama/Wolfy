const Discord = require('discord.js')
const schema = require('../schema/GuildSchema')

module.exports = {
    name: 'channelCreate',
    async execute(client, channel) {
        if (!channel) {
            return;
          }

          let data;
          try{
              data = await schema.findOne({
                  GuildID: channel.guild.id
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

          const fetchedLogs = await channel.guild.fetchAuditLogs({
            limit: 1,
            type: 'CHANNEL_CREATE',
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
        if(!channelLog || !channelLog.available && id != channel.id) {
          return;
        } else {
          //Do nothing..
        }

            const ChannelDeleted = new Discord.MessageEmbed()
            .setAuthor({ name: executor.username, iconURL: executor.displayAvatarURL({dynamic: true, size: 2048}) })
            .setTitle('<a:Up:853495519455215627> Channel Created!')
            .setDescription(`<a:iNFO:853495450111967253> **Channel Name:** ${channel.name}\n<:pp198:853494893439352842> **Channel ID:** \`${channel.id}\`\n\n<:Rules:853495279339569182> **ExecutorTag:** ${executor.tag}\n<:Tag:836168214525509653> **ChannelType:** \`\`\`${types[channel.type]}\`\`\``)
            .setColor('#2F3136')
            .setFooter({ text: channel.guild.name, iconURL: channel.guild.iconURL({dynamic: true}) })
            .setTimestamp()
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