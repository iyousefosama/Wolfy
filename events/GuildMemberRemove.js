const discord = require('discord.js')
const moment = require("moment");
const schema = require('../schema/GuildSchema')
let logs = [];
const { AuditLogEvent, ChannelType } = require('discord.js')

module.exports = {
    name: 'guildMemberRemove',
    async execute(client, member) {
      if(!member) {
        return;
      } else {
        // Do nothing..
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
          } else if(!Channel.permissionsFor(Channel.guild.members.me).has("EMBED_LINKS", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "VIEW_AUDIT_LOG", "SEND_MESSAGES")) {
            return;
          } else {
            // Do nothing..
          };

          const fetchedLogs = await member.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MemberKick,
           });
          // Since we only have 1 audit log entry in this collection, we can simply grab the first one
          const kickLog = fetchedLogs.entries.first();

          const timestamp = Math.floor(Date.now() / 1000)
        
        let target;
        let RemoveEmbed;
        if (!kickLog || !kickLog.available || kickLog?.createdAt < member.joinedAt || kickLog?.target.id != member.id) {
          RemoveEmbed = new discord.EmbedBuilder()
          .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL({dynamic: true, size: 2048}) })
          .setTitle('<a:Down:853495989796470815> Member Leave!')
          .setDescription(`<a:iNFO:853495450111967253> **MemberTag:** ${member.user.tag}\n<:pp198:853494893439352842> **MemberID:** \`${member.user.id}\`\n<a:Right:877975111846731847> **Created At:** ${moment.utc(member.user.createdAt).format('LT')} ${moment.utc(member.user.createdAt).format('LL')} (\`${moment.utc(member.user.createdAt).fromNow()}\`)\n<a:Right:877975111846731847> **Joined At:** ${moment(member.joinedAt).format("LT")} ${moment(member.joinedAt).format('LL')} (\`${moment(member.joinedAt).fromNow()}\`)`)
          .setColor('#2F3136')
          .setFooter({ text: member.guild.name, iconURL: member.guild.iconURL({dynamic: true}) })
          .setTimestamp() 
        } else if (kickLog || kickLog.available && kickLog?.createdAt < member.joinedAt && kickLog?.target.id == member.id) {
          const { executor, target } = kickLog;
          RemoveEmbed = new discord.EmbedBuilder()
          .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL({dynamic: true, size: 2048}) })
          .setTitle('<a:Mod:853496185443319809> Member Kicked!')
          .setDescription(`<a:iNFO:853495450111967253> **MemberTag:** ${member.user.tag} (\`${member.user.id}\`)\n<:MOD:836168687891382312> **Executor:** ${executor.tag}\n<a:Right:877975111846731847> **Created At:** ${moment.utc(member.user.createdAt).format('LT')} ${moment.utc(member.user.createdAt).format('LL')} (\`${moment.utc(member.user.createdAt).fromNow()}\`)\n<a:Right:877975111846731847> **Joined At:** ${moment(member.joinedAt).format("LT")} ${moment(member.joinedAt).format('LL')} (\`${moment(member.joinedAt).fromNow()}\`)`)
          .setColor('#e6a54a')
          .setFooter({ text: member.guild.name, iconURL: member.guild.iconURL({dynamic: true}) })
          .setTimestamp()
        }
        
        const botname = client.user.username;
        const webhooks = await Channel.fetchWebhooks()
        logs.push(RemoveEmbed)
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