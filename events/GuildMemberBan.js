const discord = require('discord.js')
const schema = require('../schema/GuildSchema')
let logs = [];
const { AuditLogEvent, ChannelType } = require('discord.js')

module.exports = {
    name: 'guildBanAdd',
    async execute(client, member) {
        if(!member) {
          return;
        } else {
          // Do nothing...
        }

        let data;
        try{
            data = await schema.findOne({
                GuildID: member.guild.id
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
          } else if(!Channel.permissionsFor(Channel.guild.members.me).has([discord.PermissionsBitField.Flags.EmbedLinks, discord.PermissionsBitField.Flags.ViewChannel, discord.PermissionsBitField.Flags.ReadMessageHistory, discord.PermissionsBitField.Flags.ViewAuditLog, discord.PermissionsBitField.Flags.SendMessages])) {
            return;
          } else {
            // Do nothing..
          };

          const fetchedLogs = await member.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MemberBanAdd,
          });

          const banLog = fetchedLogs.entries.first();

          if(!banLog) {
            return;
          } else {
            //Do nothing..
          }

          let { executor, target, reason } = banLog;

          if (!reason) {
            reason = "Not specified";
          }

          const timestamp = Math.floor(Date.now() / 1000)

          if(!banLog.available && target.id != member.id) {
            return;
          } else {
            //Do nothing..
          }
          
        const Ban = new discord.EmbedBuilder()
        .setAuthor({ name: target.username, iconURL: target.displayAvatarURL({dynamic: true, size: 2048}) })
        .setTitle('<a:Mod:853496185443319809> Member ban!')
        .setDescription(`<:Humans:853495153280155668> **Member:** ${target.tag} (\`${target.id}\`)\n<:MOD:836168687891382312> **Executor:** ${executor.tag}\n<:Rules:853495279339569182> **Reason:** ${reason}\n<a:Right:877975111846731847> **At:** <t:${timestamp}>`)
        .setColor('#e6a54a')
        .setFooter({ text: member.guild.name, iconURL: member.guild.iconURL({dynamic: true}) })
        .setTimestamp()
        const botname = client.user.username;
        const webhooks = await Channel.fetchWebhooks()
        logs.push(Ban)
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