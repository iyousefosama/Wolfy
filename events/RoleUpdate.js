const Discord = require('discord.js')
const { MessageEmbed} = require('discord.js')
const schema = require('../schema/GuildSchema')

module.exports = {
    name: 'roleUpdate',
    async execute(client, oldRole, newRole) {
        if (!oldRole) {
            return;
          }
          const fetchedLogs = await oldRole.guild.fetchAuditLogs({
            limit: 1,
            type: 'ROLE_UPDATE',
        });
        // Since there's only 1 audit log entry in this collection, grab the first one
        const rolelog = fetchedLogs.entries.first();
      
        const { executor, id, name, color } = rolelog;

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
          } else if (Channel.type !== 'GUILD_TEXT') {
            return;
          } else if (!data.Mod.Logs.isEnabled){
            return;
          } else if(!oldRole.guild.me.permissions.has("SEND_MESSAGES") || !oldRole.guild.me.permissions.has("ADMINISTRATOR")) {
            return;
          } else {
            // Do nothing..
          };

          let RoleUpdated;
          if (oldRole.name !== newRole.name) {
            RoleUpdated = new MessageEmbed()
            .setAuthor(executor.username, executor.displayAvatarURL({dynamic: true, size: 2048}))
            .setTitle('<a:Mod:853496185443319809> Role Renamed!')
            .setDescription(`<a:Right:860969895779893248> oldRole Name: ${oldRole.name}\n<a:Right:860969895779893248> newRole Name: ${newRole.name}\n<:pp198:853494893439352842> Role ID: \`${oldRole.id}\`\n\n<:Rules:853495279339569182> ExecutorTag: ${executor.tag}`)
            .setColor('#2F3136')
            .setFooter(oldRole.guild.name, oldRole.guild.iconURL({dynamic: true}))
            .setTimestamp()
          } else if (oldRole.color !== newRole.color) {
            RoleUpdated = new MessageEmbed()
            .setAuthor(executor.username, executor.displayAvatarURL({dynamic: true, size: 2048}))
            .setTitle('<a:Mod:853496185443319809> Role Color changed!')
            .setDescription(`<a:iNFO:853495450111967253> Role Name: ${newRole.name}\n<:pp198:853494893439352842> Role ID: \`${newRole.id}\`\n<a:Right:877975111846731847> oldRole color: ${oldRole.color}\n<a:Right:877975111846731847> newRole color: ${newRole.color}\n\n<:Rules:853495279339569182> ExecutorTag: ${executor.tag}`)
            .setColor(newRole.color || '#ed7947')
            .setFooter(oldRole.guild.name, oldRole.guild.iconURL({dynamic: true}))
            .setTimestamp()
          } else if(oldRole.name !== newRole.name && oldRole.color !== newRole.color) {
            RoleUpdated = new MessageEmbed()
            .setAuthor(executor.username, executor.displayAvatarURL({dynamic: true, size: 2048}))
            .setTitle('<a:Mod:853496185443319809> Role Updated!')
            .setDescription(`<a:Right:860969895779893248> oldRole Name: ${oldRole.name}\n<a:Right:860969895779893248> newRole Name: ${newRole.name}\n<:pp198:853494893439352842> Role ID: \`${oldRole.id}\`\n<a:Right:877975111846731847> oldRole color: ${oldRole.color}\n<a:Right:877975111846731847> newRole color: ${newRole.color}\n\n<:Rules:853495279339569182> ExecutorTag: ${executor.tag}`)
            .setColor(newRole.color || '#2F3136')
            .setFooter(oldRole.guild.name, oldRole.guild.iconURL({dynamic: true}))
            .setTimestamp()
          } else {
            return;
          }

            const botname = client.user.username;
            const webhooks = await Channel.fetchWebhooks()
            setTimeout(async function(){
            let webhook = webhooks.filter((w)=>w.type === "Incoming" && w.token).first();
            if(!webhook){
              webhook = await Channel.createWebhook(botname, {avatar: client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 128 })})
            }
            webhook.send({embeds: [RoleUpdated]})
            .catch(() => {});
          }, 5000);
              // add more functions on ready  event callback function...
            
              return;
    }
}