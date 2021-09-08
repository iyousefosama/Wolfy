const Discord = require('discord.js')
const schema = require('../schema/GuildSchema')

module.exports = {
    name: 'channelCreate',
    async execute(client, channel) {
        if (!channel) {
            return;
          }
          const fetchedLogs = await channel.guild.fetchAuditLogs({
            limit: 1,
            type: 'CHANNEL_CREATE',
        });
        // Since there's only 1 audit log entry in this collection, grab the first one
        const channelLog = fetchedLogs.entries.first();
      
        const { executor, type, id, name } = channelLog;

          let data;
          try{
              data = await schema.findOne({
                  GuildID: channel.guild.id
              })
              if(!data) return;
          } catch(err) {
              console.log(err)
          }
          let Channel = client.channels.cache.get(data.LogsChannel)
          if(!Channel) return;
          if(Channel.type !== 'GUILD_TEXT') return;

            const ChannelCreate = new Discord.MessageEmbed()
            .setAuthor(executor.username, executor.displayAvatarURL({dynamic: true, size: 2048}))
            .setTitle('<a:Up:853495519455215627> Channel Created!')
            .setDescription(`<a:iNFO:853495450111967253> Channel Name: ${channel.name}\n<:pp198:853494893439352842> Channel ID: \`${channel.id}\`\n\n<:Rules:853495279339569182> ExecutorTag: ${executor.tag}\n<:Tag:836168214525509653> ChannelType: \`\`\`${channel.type}\`\`\``)
            .setColor('#2F3136')
            .setFooter(channel.guild.name, channel.guild.iconURL({dynamic: true}))
            .setTimestamp()
            const botname = client.user.username;
            try {
                const webhooks = await Channel.fetchWebhooks();
                const webhook = webhooks.first();
            
                await webhook.send({
                  embeds: [ChannelCreate],
                  username: bot,
                  avatarURL: client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 128 })
                });
              } catch(error) {
            await Channel?.createWebhook(botname, {
                avatar: client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 128 })
              })
              .then(webhook => Promise.all([webhook.send({ embeds: [ChannelCreate] }), webhook]))
              }
              // add more functions on ready  event callback function...
            
              return;
    }
}