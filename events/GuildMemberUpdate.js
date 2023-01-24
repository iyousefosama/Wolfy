const discord = require('discord.js')
const moment = require("moment");
const schema = require('../schema/GuildSchema')
let logs = [];
const { AuditLogEvent, ChannelType } = require('discord.js')

module.exports = {
    name: 'guildMemberUpdate',
    async execute(client, oldMember, newMember) {
        if(!oldMember) {
            return;
        } else {
        // Do nothing..
        }

        let data;
        try{
            data = await schema.findOne({
                GuildID: oldMember.guild.id
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


        const fetchedLogs = await oldMember.guild.fetchAuditLogs({
          limit: 1,
          type: AuditLogEvent.GuildMemberUpdate,
        });

        const memberlog = fetchedLogs.entries.first();
        
        if(!memberlog) {
          return;
        } else {
          //Do nothing..
        }

        const { executor, target } = memberlog;
        const timestamp = Math.floor(Date.now() / 1000)

        if(memberlog.available && target.id != oldMember.id) {
          return;
        } else {
          //Do nothing..
        }

        let MemberUpdate;
        if (oldMember.nickname != newMember.nickname) {
          MemberUpdate = new discord.EmbedBuilder()
          .setAuthor({ name: oldMember.user.tag + ` (${oldMember.id})`, iconURL: oldMember.user.displayAvatarURL({dynamic: true, size: 2048}) })
          .setTitle('📝 Member Nickname Updated!')
          .setDescription(`\`${[ oldMember.nickname ? oldMember.nickname : oldMember.user.tag ]}\` **➜** \`${[ newMember.nickname ? newMember.nickname : newMember.user.tag ]}\`\n\n<:MOD:836168687891382312> **Executor:** ${executor.tag}\n<a:Right:877975111846731847> **At:** <t:${timestamp}>`)
          .setColor('#2F3136')
          .setFooter({ text: oldMember.guild.name, iconURL: oldMember.guild.iconURL({dynamic: true}) })
          .setTimestamp()
        } else if(oldMember.roles.cache.size < newMember.roles.cache.size) {
          let role = newMember.roles.cache.filter(r => !oldMember.roles.cache.has(r.id)).first();
          MemberUpdate = new discord.EmbedBuilder()
           .setTitle('📝 Member Role Added!')
           .setAuthor({ name: oldMember.user.tag, iconURL: oldMember.user.displayAvatarURL({dynamic: true, size: 2048}) })
           .setColor('#2F3136')
           .setDescription(`<:Humans:853495153280155668> **Member:** ${oldMember.user.tag} (\`${oldMember.id}\`)\n<a:Mod:853496185443319809> **Executor:** ${executor.tag}\n<a:Right:877975111846731847> **At:** <t:${timestamp}>\n\n<a:Up:853495519455215627> **Role:**\n \`\`\`${role.name}\`\`\``)
           .setFooter({ text: oldMember.guild.name, iconURL: oldMember.guild.iconURL({dynamic: true}) })
           .setTimestamp()
          } else if(oldMember.roles.cache.size > newMember.roles.cache.size) {
           let role = oldMember.roles.cache.filter(r => !newMember.roles.cache.has(r.id)).first();
           MemberUpdate = new discord.EmbedBuilder()
           .setTitle('📝 Member Role Removed!')
           .setAuthor({ name: oldMember.user.tag, iconURL: oldMember.user.displayAvatarURL({dynamic: true, size: 2048}) })
           .setColor('#2F3136')
           .setDescription(`<:Humans:853495153280155668> **Member:** ${oldMember.user.tag} (\`${oldMember.id}\`)\n<a:Mod:853496185443319809> **Executor:** ${executor.tag}\n<a:Right:877975111846731847> **At:** <t:${timestamp}>\n\n<a:Down:853495989796470815> **Role:**\n \`\`\`${role.name}\`\`\``)
           .setFooter({ text: oldMember.guild.name, iconURL: oldMember.guild.iconURL({dynamic: true}) })
           .setTimestamp()
         } else {
          // Do no thing...
        }
        
        const botname = client.user.username;
        const webhooks = await Channel.fetchWebhooks()
        logs.push(MemberUpdate)
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