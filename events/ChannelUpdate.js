const discord = require('discord.js')
const { EmbedBuilder } = require('discord.js')
const schema = require('../schema/GuildSchema')
let logs = [];
const { AuditLogEvent, ChannelType } = require('discord.js')

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
          } else if (Channel.type !== ChannelType.GuildText) {
            return;
          } else if (!data.Mod.Logs.isEnabled){
            return;
          } else if(!Channel.permissionsFor(Channel.guild.members.me).has(discord.PermissionsBitField.Flags.EmbedLinks, discord.PermissionsBitField.Flags.ViewChannel, discord.PermissionsBitField.Flags.ReadMessageHistory, discord.PermissionsBitField.Flags.ViewAuditLog, discord.PermissionsBitField.Flags.SendMessages)) {
            return;
          } else {
            // Do nothing..
          };

          const fetchedLogs = await oldChannel.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.ChannelUpdate,
        });
        // Since there's only 1 audit log entry in this collection, grab the first one
        const channelLog = fetchedLogs.entries.first();

        if(!channelLog) {
          return;
        } else {
          //Do nothing..
        }
      
        const { executor, target, id, name } = channelLog;
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
        if(!channelLog.available && target.id != oldChannel.id) {
          return;
        } else {
          //Do nothing..
        }

        /*
        const PermissionsObj = Object.values(newChannel.permissionOverwrites);
        console.log(PermissionsObj)
        PermissionsObj.forEach(e => {
          console.log(e.permissionOverwrites)
        });
        */


        ChannelUpdate = new EmbedBuilder()
        .setAuthor({ name: executor.username, iconURL: executor.displayAvatarURL({dynamic: true, size: 2048}) })
        .setTitle('<a:Mod:853496185443319809> Channel Updated!')
        .setColor('#e6a54a')
        .setFooter({ text: oldChannel.guild.name, iconURL: oldChannel.guild.iconURL({dynamic: true}) })
        .setTimestamp()
        .setDescription([
             `<:pp198:853494893439352842> **Channel:** ${oldChannel.name}(\`${oldChannel.id}\`)\n<:Rules:853495279339569182> **ExecutorTag:** ${executor.tag}\n\n`,
              oldChannel.name !== newChannel.name ? `\`${oldChannel.name}\` **➜** \`${newChannel.name}\`\n` : '',
              oldChannel.type !== newChannel.type ? `<:Tag:836168214525509653> **Old Type:** \`\`\`${types[oldChannel.type]}\`\`\`\n<:Tag:836168214525509653> **New Type:** \`\`\`${types[newChannel.type]}\`\`\`` : ''
            ].join(''));
          
          const botname = client.user.username;
          const webhooks = await Channel.fetchWebhooks()
          logs.push(ChannelUpdate)
          setTimeout(async function(){
          let webhook = webhooks.filter((w)=>w.token).first();
          if(!webhook){
            webhook = await Channel.createWebhook({ name: botname, avatar: client.user.displayAvatarURL({ extension:'png', dynamic: true, size: 128 })})(botname, {avatar: client.user.displayAvatarURL({ extension:'png', dynamic: true, size: 128 })})
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