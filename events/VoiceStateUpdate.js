const discord = require('discord.js')
const schema = require('../schema/GuildSchema')
let logs = []
const { AuditLogEvent, ChannelType } = require('discord.js')

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
          } else if (Channel.type !== ChannelType.GuildText) {
            return;
          } else if (!data.Mod.Logs.isEnabled){
            return;
          } else if(!Channel.permissionsFor(Channel.guild.members.me).has(discord.PermissionsBitField.Flags.EmbedLinks, discord.PermissionsBitField.Flags.ViewChannel, discord.PermissionsBitField.Flags.ReadMessageHistory, discord.PermissionsBitField.Flags.ViewAuditLog, discord.PermissionsBitField.Flags.SendMessages)) {
            return;
          } else {
            // Do nothing..
          };

        const timestamp = Math.floor(Date.now() / 1000)
        let VoiceUpdate;
        // JOINED
        if (!oldState.channelId && newState.channelId && !oldState.channel && newState.channel) {
            VoiceUpdate = new discord.EmbedBuilder()
            .setAuthor({ name: oldState.member.user.tag, iconURL: oldState.member.displayAvatarURL({dynamic: true, size: 2048}) })
            .setDescription(`<a:Up:853495519455215627> **${oldState.member} joined the voice channel ${newState.channel}**!`)
            .setColor('Green')
            .setFooter({ text: oldState.guild.name, iconURL: oldState.guild.iconURL({dynamic: true}) })
            .setTimestamp()
        }

        // LEFT
        if (oldState.channelId && !newState.channelId && oldState.channel && !newState.channel) {
            VoiceUpdate = new discord.EmbedBuilder()
            .setAuthor({ name: oldState.member.user.tag, iconURL: oldState.member.displayAvatarURL({dynamic: true, size: 2048}) })
            .setDescription(`<a:Down:853495989796470815> **${oldState.member} left the voice channel ${oldState.channel}**!`)
            .setColor('Red')
            .setFooter({ text: oldState.guild.name, iconURL: oldState.guild.iconURL({dynamic: true}) })
            .setTimestamp()
        }

        // MUTE OR DEFEAN
        if(oldState.selfMute === true && newState.selfMute === false) {
          return;
        } else if (oldState.selfMute === false && newState.selfMute === true) {
          return;
        } else if (oldState.selfDeaf === true && newState.selfDeaf === false) {
          return;
        } else if (oldState.selfDeaf === false && newState.selfDeaf === true) {
          return;
        };

        // SWITCH
        if (oldState.channelId && newState.channelId && oldState.channel && newState.channel) {
            VoiceUpdate = new discord.EmbedBuilder()
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