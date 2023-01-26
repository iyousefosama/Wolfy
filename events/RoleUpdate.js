const discord = require('discord.js')
const { EmbedBuilder} = require('discord.js')
const schema = require('../schema/GuildSchema')
const text = require('../util/string');
let logs = [];
const { AuditLogEvent, ChannelType } = require('discord.js')

module.exports = {
    name: 'roleUpdate',
    async execute(client, oldRole, newRole) {
        if (!oldRole) {
            return;
          } else {
            // Do nothing..
          }

          let data;
          try{
              data = await schema.findOne({
                  GuildID: oldRole.guild.id
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

          const fetchedLogs = await oldRole.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.RoleUpdate,
        });
        // Since there's only 1 audit log entry in this collection, grab the first one
        const rolelog = fetchedLogs.entries.first();

        if(!rolelog) {
          return;
        } else {
          //Do nothing..
        }
      
        const { executor, target, id, name, color } = rolelog;

        if(!rolelog || !rolelog.available && target.id != oldRole.id) {
          return;
        } else {
          //Do nothing..
        }

          let RoleUpdated;
          if (oldRole.name !== newRole.name) {
            RoleUpdated = new EmbedBuilder()
            .setAuthor({ name: executor.username, iconURL: executor.displayAvatarURL({dynamic: true, size: 2048}) })
            .setTitle('<a:Mod:853496185443319809> Role Renamed!')
            .setDescription(`<a:Right:860969895779893248> **oldRole Name:** ${oldRole.name}\n<a:Right:860969895779893248> **newRole Name:** ${newRole.name}\n<:pp198:853494893439352842> **Role ID:** \`${oldRole.id}\`\n\n<:Rules:853495279339569182> **ExecutorTag:** ${executor.tag}`)
            .setColor('#2F3136')
            .setFooter({ text: oldRole.guild.name, iconURL: oldRole.guild.iconURL({dynamic: true}) })
            .setTimestamp()
          } else if (oldRole.color !== newRole.color) {
            RoleUpdated = new EmbedBuilder()
            .setAuthor({ name: executor.username, iconURL: executor.displayAvatarURL({dynamic: true, size: 2048}) })
            .setTitle('<a:Mod:853496185443319809> Role Color changed!')
            .setDescription(`<a:iNFO:853495450111967253> **Role Name:** ${newRole.name}\n<:pp198:853494893439352842> **Role ID:** \`${newRole.id}\`\n<a:Right:877975111846731847> **oldRole color:** ${oldRole.color}\n<a:Right:877975111846731847> **newRole color:** ${newRole.color}\n\n<:Rules:853495279339569182> **ExecutorTag:** ${executor.tag}`)
            .setColor(newRole.color || '#ed7947')
            .setFooter({ text: oldRole.guild.name, iconURL: oldRole.guild.iconURL({dynamic: true}) })
            .setTimestamp()
          } else if(oldRole.name !== newRole.name && oldRole.color !== newRole.color) {
            RoleUpdated = new EmbedBuilder()
            .setAuthor({ name: executor.username, iconURL: executor.displayAvatarURL({dynamic: true, size: 2048}) })
            .setTitle('<a:Mod:853496185443319809> Role Updated!')
            .setDescription(`<a:Right:860969895779893248> **oldRole Name:** ${oldRole.name}\n<a:Right:860969895779893248> **newRole Name:** ${newRole.name}\n<:pp198:853494893439352842> **Role ID:** \`${oldRole.id}\`\n<a:Right:877975111846731847> **oldRole color:** ${oldRole.color}\n<a:Right:877975111846731847> **newRole color:** ${newRole.color}\n\n<:Rules:853495279339569182> **ExecutorTag:** ${executor.tag}`)
            .setColor(newRole.color || '#2F3136')
            .setFooter({ text: oldRole.guild.name, iconURL: oldRole.guild.iconURL({dynamic: true}) })
            .setTimestamp()
          } else if(oldRole.permissions !== newRole.permissions) {
            const Osp = oldRole.permissions.serialize();
            const Nsp = newRole.permissions.serialize();
            RoleUpdated = new EmbedBuilder()
            .setAuthor({ name: executor.username, iconURL: executor.displayAvatarURL({dynamic: true, size: 2048}) })
            .setTitle('<a:Mod:853496185443319809> Role permissions Updated!')
            .setDescription(`<a:Right:860969895779893248> **Role:** ${newRole.name} (\`${oldRole.id}\`)\n<:Rules:853495279339569182> **ExecutorTag:** ${executor.tag}\n\n**Old Permissions** | **New Permissions** \n\`\`\`\n${Object.keys(Osp).map(perm => [
              Osp[perm] ? '✔️ |' : '❌ |',
              Nsp[perm] ? '✔️ |' : '❌ |',
              perm.split('_').map(x => x[0] + x.slice(1).toLowerCase()).join(' ')
            ].join(' ')).join('\n')}\`\`\``)
            .setColor(newRole.color || '#2F3136')
            .setFooter({ text: oldRole.guild.name, iconURL: oldRole.guild.iconURL({dynamic: true}) })
            .setTimestamp()
           } else {
            // Do nothing..
          }

            const botname = client.user.username;
            const webhooks = await Channel.fetchWebhooks()
            logs.push(RoleUpdated)
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