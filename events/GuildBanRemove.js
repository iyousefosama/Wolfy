const Discord = require('discord.js')
const moment = require("moment");
const schema = require('../schema/GuildSchema')
let logs = [];
module.exports = {
    name: 'guildBanRemove',
    async execute(client, user) {

        let data;
        try{
            data = await schema.findOne({
                GuildID: user.guild.id
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

          const fetchedLogs = await user.guild.fetchAuditLogs({
            limit: 1,
            type: "MEMBER_BAN_REMOVE",
          });

          const unbanLog = fetchedLogs.entries.first();

          if(!unbanLog) {
            return;
          } else {
            //Do nothing..
          }

          const { executor, target } = unbanLog;

          const timestamp = Math.floor(Date.now() / 1000)

          if(!unbanLog.available && target.id != user.id) {
            return;
          } else {
            //Do nothing..
          }
        
        const Unban = new Discord.MessageEmbed()
        .setAuthor({ name: target.username, iconURL: target.displayAvatarURL({dynamic: true, size: 2048}) })
        .setTitle('<a:Mod:853496185443319809> Member Unban!')
        .setDescription(`<:Humans:853495153280155668> **Member:** ${target.tag} (\`${target.id}\`)\n<:MOD:836168687891382312> **Executor:** ${executor.tag}\n<a:Right:877975111846731847> **At:** <t:${timestamp}>`)
        .setColor('#ffd167')
        .setFooter({ text: user.guild.name, iconURL: user.guild.iconURL({dynamic: true}) })
        .setTimestamp()
        const botname = client.user.username;
        const webhooks = await Channel.fetchWebhooks()
        logs.push(Unban)
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