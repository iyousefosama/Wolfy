const discord = require('discord.js')
const schema = require('../schema/GuildSchema')
let logs = [];
const { AuditLogEvent, ChannelType } = require('discord.js')

const requiredPermissions = [
  discord.PermissionsBitField.Flags.ViewAuditLog,
  discord.PermissionsBitField.Flags.SendMessages,
  discord.PermissionsBitField.Flags.ViewChannel,
  discord.PermissionsBitField.Flags.ReadMessageHistory,
  discord.PermissionsBitField.Flags.EmbedLinks,
];

module.exports = {
    name: 'channelDelete',
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
          } else if (Channel.type !== ChannelType.GuildText) {
            return;
          } else if (!data.Mod.Logs.isEnabled){
            return;
          } else if(!Channel.permissionsFor(Channel.guild.members.me).has(requiredPermissions)) {
            return;
          } else {
            // Do nothing..
          };

          const fetchedLogs = await channel.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.ChannelDelete,
        });
        // Since there's only 1 audit log entry in this collection, grab the first one
        const channelLog = fetchedLogs.entries.first();

        if(!channelLog) {
          return;
        } else {
          //Do nothing..
        }
      
        const { executor, target, type, id, name } = channelLog;
        const types = {
          0: "Text Channel",
          2: "Voice Channel",
          4: "CATEGORY",
          5: "Guild Announcement",
          10: "News Thread",
          11: "Public Thread",
          12: "Private Thread",
          13: "Stage Voice",
          15: "Guild Forum"
      }
        if(!channelLog.available && target.id != channel.id) {
          return;
        } else {
          //Do nothing..
        }

            const ChannelDeleted = new discord.EmbedBuilder()
            .setAuthor({ name: executor.username, iconURL: executor.displayAvatarURL({dynamic: true, size: 2048}) })
            .setTitle('<a:Down:853495989796470815> Channel deleted!')
            .setDescription(`<a:iNFO:853495450111967253> **Channel Name:** ${channel.name}\n<:pp198:853494893439352842> **Channel ID:** \`${channel.id}\`\n\n<:Rules:853495279339569182> **ExecutorTag:** ${executor.tag}\n<:Tag:836168214525509653> **ChannelType:** \`\`\`${types[channel.type]}\`\`\``)
            .setColor('Red')
            .setFooter({ text: channel.guild.name, iconURL: channel.guild.iconURL({dynamic: true}) })
            .setTimestamp()
            const botname = client.user.username;
            const webhooks = await Channel.fetchWebhooks()
            logs.push(ChannelDeleted)
            setTimeout(async function(){
            let webhook = webhooks.filter((w)=>w.token).first();
            if(!webhook){
              webhook = await Channel.createWebhook({ name: botname, avatar: client.user.displayAvatarURL({ extension:'png', dynamic: true, size: 128 })})(botname, {avatar: client.user.displayAvatarURL({ extension:'png', dynamic: true, size: 128 })})
            } else if(webhooks.size <= 10) {
              // Do no thing...
            }
            while (logs.length > 0) {
              webhook.send({ embeds: logs.slice(0, 10) }).catch(() => {});
              logs = logs.slice(10); // Remove the sent embeds from the logs
            }
          }, 10000);
              // add more functions on ready  event callback function...
            
              return;
    }
}