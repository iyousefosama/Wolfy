const Discord = require('discord.js')
const moment = require("moment");
const schema = require('../schema/GuildSchema')

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
          } else if (Channel.type !== 'GUILD_TEXT') {
            return;
          } else if (!data.Mod.Logs.isEnabled){
            return;
          } else if(!Channel.guild.me.permissions.has("SEND_MESSAGES") || !Channel.guild.me.permissions.has("ADMINISTRATOR")) {
            return;
          } else {
            // Do nothing..
          };


        const fetchedLogs = await oldMember.guild.fetchAuditLogs({
          limit: 1,
          type: "GUILD_MEMBER_UPDATE",
        });

        const memberlog = fetchedLogs.entries.first();

        const { executor, target } = memberlog;
        const timestamp = Math.floor(Date.now() / 1000)

        let MemberUpdate;
        if (memberlog && oldMember.nickname != newMember.nickname && target.id == oldMember.id) {
          MemberUpdate = new Discord.MessageEmbed()
          .setAuthor(oldMember.user.tag + ` (${oldMember.id})`, oldMember.user.displayAvatarURL({dynamic: true, size: 2048}))
          .setTitle('📝 Member Nickname Updated!')
          .setDescription(`\`${[oldMember.nickname !== null? oldMember.nickname : oldMember.username]}\` **➜** \`${[newMember.nickname !== null? newMember.nickname : newMember.username]}\`\n\n<:MOD:836168687891382312> **Executor:** ${executor.tag}\n<a:Right:877975111846731847> **At:** <t:${timestamp}>`)
          .setColor('#2F3136')
          .setFooter(oldMember.guild.name, oldMember.guild.iconURL({dynamic: true}))
          .setTimestamp()
        } else if(memberlog && oldMember.roles.cache.size > newMember.roles.cache.siz) {
          MemberUpdate = new Discord.MessageEmbed()
          .setAuthor(oldMember.user.tag + ` (${oldMember.id})`, oldMember.user.displayAvatarURL({dynamic: true, size: 2048}))
          .setTitle('📝 Member Roles Removed!')
          .setDescription(`<:MOD:836168687891382312> **Executor:** ${executor.tag}\n<a:Right:877975111846731847> **At:** <t:${timestamp}>`)
          .setColor('#2F3136')
          .setFooter(oldMember.guild.name, oldMember.guild.iconURL({dynamic: true}))
          .setTimestamp()
          oldMember.roles.cache.forEach(role => {
            if (!newMember.roles.cache.has(role.id)) {
              MemberUpdate.addField("⛔ Roles Removed", role);
            }
          });
        } else if(oldMember.roles.cache.size < newMember.roles.cache.size) {
          MemberUpdate = new Discord.MessageEmbed()
          .setAuthor(oldMember.user.tag + ` (${oldMember.id})`, oldMember.user.displayAvatarURL({dynamic: true, size: 2048}))
          .setTitle('📝 Member Roles Added!')
          .setDescription(`<:MOD:836168687891382312> **Executor:** ${executor.tag}\n<a:Right:877975111846731847> **At:** <t:${timestamp}>`)
          .setColor('#2F3136')
          .setFooter(oldMember.guild.name, oldMember.guild.iconURL({dynamic: true}))
          .setTimestamp()
          newMember.roles.cache.forEach(role => {
            if (!oldMember.roles.cache.has(role.id)) {
              MemberUpdate.addField("✔️ **Role Added**", role);
            }
          });
        } else {
          // Do no thing...
        }
        
        const botname = client.user.username;
        const webhooks = await Channel.fetchWebhooks()
        setTimeout(async function(){
        let webhook = webhooks.filter((w)=>w.type === "Incoming" && w.token).first();
        if(!webhook){
          webhook = await Channel.createWebhook(botname, {avatar: client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 128 })})
        } else if(webhooks.size <= 10) {
          // Do no thing...
        }
        webhook.send({embeds: [MemberUpdate]})
        .catch(() => {});
    }, 5000);
        
          // add more functions on ready  event callback function...
        
          return;
    }
}