const Discord = require('discord.js')
const moment = require("moment");
const schema = require('../schema/GuildSchema')

module.exports = {
    name: 'guildBanAdd',
    async execute(client, user, guild) {

        const fetchedLogs = await user.guild.fetchAuditLogs({
            limit: 1,
            type: "MEMBER_BAN_ADD",
          });

          const banLog = fetchedLogs.entries.first();

          const { executor, target, reason } = banLog;

          if (!reason) reason = "Not specified";

        let data;
        try{
            data = await schema.findOne({
                GuildID: user.guild.id
            })
            if(!data) return;
        } catch(err) {
            console.log(err)
        }
        let Channel = client.channels.cache.get(data.LogsChannel)
        if(!Channel) return;
        if(Channel.type !== 'GUILD_TEXT') return;
        if(data.ToggleLogsChannel == false) return;
        
        const Ban = new Discord.MessageEmbed()
        .setAuthor(target.username, target.displayAvatarURL({dynamic: true, size: 2048}))
        .setTitle('<a:pp681:774089750373597185> Member ban!')
        .setDescription(`<:Humans:853495153280155668> **Member:** ${target.tag} (\`${target.id}\`)\n<a:Mod:853496185443319809> **Executor:** ${executor.tag}\n<:Rules:853495279339569182> **Reason:** ${reason}\n<a:Right:877975111846731847> **At:** (\`${new Date()}\`)`)
        .setColor('RED')
        .setFooter(user.guild.name, user.guild.iconURL({dynamic: true}))
        .setTimestamp()
        const botname = client.user.username;
        const webhooks = await Channel.fetchWebhooks()
        setTimeout(async function(){
        let webhook = webhooks.filter((w)=>w.type === "Incoming" && w.token).first();
        if(!webhook){
          webhook = await Channel.createWebhook(botname, {avatar: client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 128 })})
        }
        webhook.send({embeds: [Ban]})
        .catch(() => {});
      }, 5000);
          // add more functions on ready  event callback function...
        
          return;
    }
}