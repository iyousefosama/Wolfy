const Discord = require('discord.js')
const schema = require('../schema/GuildSchema')
let logs = [];

module.exports = {
    name: 'roleCreate',
    async execute(client, role) {
        if (!role) {
            return;
          }

          let data;
          try{
              data = await schema.findOne({
                  GuildID: role.guild.id
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

          const fetchedLogs = await role.guild.fetchAuditLogs({
            limit: 1,
            type: 'ROLE_CREATE',
        });
        // Since there's only 1 audit log entry in this collection, grab the first one
        const rolelog = fetchedLogs.entries.first();

        if(!rolelog) {
          return;
        } else {
          //Do nothing..
        }
      
        const { executor, target, id, name } = rolelog;

        if(!rolelog || !rolelog.available && target.id != role.id) {
          return;
        } else {
          //Do nothing..
        }

            const RoleCreated = new Discord.MessageEmbed()
            .setAuthor({ name: executor.username, iconURL: executor.displayAvatarURL({dynamic: true, size: 2048}) })
            .setTitle('<a:Up:853495519455215627> Role Created!')
            .setDescription(`<a:iNFO:853495450111967253> **Role Name:** ${role.name}\n<:pp198:853494893439352842> **Role ID:** \`${role.id}\`\n\n<:Rules:853495279339569182> **ExecutorTag:** ${executor.tag}`)
            .setColor('#2F3136')
            .setFooter({ text: role.guild.name, iconURL: role.guild.iconURL({dynamic: true}) })
            .setTimestamp()
            const botname = client.user.username;
            const webhooks = await Channel.fetchWebhooks()
            logs.push(RoleCreated)
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