const Discord = require('discord.js')
const schema = require('../schema/GuildSchema')
let logs = []

module.exports = {
    name: 'voiceStateUpdate',
    async execute(client, oldState, newState) {

        if (!oldState || oldState.user == client) return;

        if (oldState.channel === null && newState.channel === null) return;

        let data;
        try{
            data = await schema.findOne({
                GuildID: oldState.guild.id
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

        const timestamp = Math.floor(Date.now() / 1000)
        let VoiceUpdate;
        // JOINED
        if (!oldState.channelId && newState.channelId && !oldState.channel && newState.channel) {
            VoiceUpdate = new Discord.MessageEmbed()
            .setAuthor({ name: oldState.member.user.tag, iconURL: oldState.member.displayAvatarURL({dynamic: true, size: 2048}) })
            .setDescription(`<a:Up:853495519455215627> **${oldState.member} joined the voice channel ${newState.channel}**!`)
            .setColor('GREEN')
            .setFooter({ text: oldState.guild.name, iconURL: oldState.guild.iconURL({dynamic: true}) })
            .setTimestamp()
        }

        // LEFT
        if (oldState.channelId && !newState.channelId && oldState.channel && !newState.channel) {
            VoiceUpdate = new Discord.MessageEmbed()
            .setAuthor({ name: oldState.member.user.tag, iconURL: oldState.member.displayAvatarURL({dynamic: true, size: 2048}) })
            .setDescription(`<a:Down:853495989796470815> **${oldState.member} left the voice channel ${oldState.channel}**!`)
            .setColor('RED')
            .setFooter({ text: oldState.guild.name, iconURL: oldState.guild.iconURL({dynamic: true}) })
            .setTimestamp()
        }

        // MUTE OR DEFEAN
        if(!oldState.member.selfMute && newState.member.selfMute || oldState.member.selfMute && !newState.member.selfMute || !oldState.member.selfDeaf && newState.member.selfDeaf || oldState.member.selfDeaf && !newState.member.selfDeaf) {
          return;
        }

        // SWITCH
        if (oldState.channelId && newState.channelId && oldState.channel && newState.channel) {
            VoiceUpdate = new Discord.MessageEmbed()
            .setAuthor({ name: oldState.member.user.tag, iconURL: oldState.member.displayAvatarURL({dynamic: true, size: 2048}) })
            .setDescription(`<a:Right:877975111846731847> **${oldState.member} switched voice channel ${oldState.channel} ➜ ${newState.channel}**!`)
            .setColor('#e6a54a')
            .setFooter({ text: oldState.guild.name, iconURL: oldState.guild.iconURL({dynamic: true}) })
            .setTimestamp()
        }
        const botname = client.user.username;
        const webhooks = await Channel.fetchWebhooks()
        logs.push(VoiceUpdate)
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