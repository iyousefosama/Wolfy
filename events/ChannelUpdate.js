const Discord = require('discord.js')
const schema = require('../schema/GuildSchema')

module.exports = {
    name: 'channelUpdate',
    async execute(client, oldChannel, newChannel) {
        if (!oldChannel) {
            return;
          }
          const fetchedLogs = await oldChannel.guild.fetchAuditLogs({
            limit: 1,
            type: 'CHANNEL_UPDATE',
        });
        // Since there's only 1 audit log entry in this collection, grab the first one
        const channelLog = fetchedLogs.entries.first();
      
        const { executor, type, id, name } = channelLog;

          let data;
          try{
              data = await schema.findOne({
                  GuildID: oldChannel.guild.id
              })
              if(!data) return;
          } catch(err) {
              console.log(err)
          }
          let Channel = client.channels.cache.get(data.LogsChannel)
          if(!Channel) return;
          if(Channel.type !== 'GUILD_TEXT') return;

            const ChannelDeleted = new Discord.MessageEmbed()
            .setAuthor(executor.username, executor.displayAvatarURL({dynamic: true, size: 2048}))
            .setTitle('<a:Mod:853496185443319809> Channel Updated!')
            .setDescription(`<a:Right:860969895779893248> oldChannel Name: ${oldChannel.name}\n<a:Right:860969895779893248> newChannel Name: ${newChannel.name}\n<:pp198:853494893439352842> Channel ID: \`${oldChannel.id}\`\n\n<:Rules:853495279339569182> ExecutorTag: ${executor.tag}\n<:Tag:836168214525509653> oldChannelType: \`\`\`${oldChannel.type}\`\`\`\n<:Tag:836168214525509653> newChannelType: \`\`\`${newChannel.type}\`\`\``)
            .setColor('f4af2a')
            .setFooter(oldChannel.guild.name, oldChannel.guild.iconURL({dynamic: true}))
            .setTimestamp()
            const botname = client.user.username;
            await Channel?.createWebhook(botname, {
                avatar: client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 128 })
              })
              .then(webhook => Promise.all([webhook.send({ embeds: [ChannelDeleted] }), webhook]))
              .then(([_, webhook]) => webhook.delete())
              .catch(() => {});
            
              // add more functions on ready  event callback function...
            
              return;
    }
}
