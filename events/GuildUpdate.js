const discord = require('discord.js')
const schema = require('../schema/GuildSchema')
let logs = [];
const { AuditLogEvent, ChannelType } = require('discord.js')

module.exports = {
    name: 'guildUpdate',
    async execute(client, oldGuild, newGuild) {
        if(!oldGuild) {
            return;
        } else {
        // Do nothing..
        }

        let data;
        try{
            data = await schema.findOne({
                GuildID: oldGuild.id
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


        const fetchedLogs = await oldGuild.fetchAuditLogs({
          limit: 1,
          type: AuditLogEvent.GuildUpdate,
        });

        const guildlog = fetchedLogs.entries.first();

        console.log(guildlog)
        
        if(!guildlog) {
          return;
        } else {
          //Do nothing..
        }

        const { executor, target } = guildlog;
        const timestamp = Math.floor(Date.now() / 1000)

        console.log(target.id, oldGuild.id)

        if(!guildlog || target.id != oldGuild.id) {
          return;
        } else {
          //Do nothing..
        }

        const GuildUpdate = new discord.EmbedBuilder()
        .setAuthor({ name: executor.tag + ` (${executor.id})`, iconURL: executor.displayAvatarURL({dynamic: true, size: 2048}) })
        .setTitle('📝 Guild Updated!')
        .setDescription([
            oldGuild.name !== newGuild.name ? `Name: \`${oldGuild.name}\` **➜** \`${newGuild.name}\`` : ``,
            oldGuild.region !== newGuild.region ? `Region: \`${oldGuild.region}\` **➜** \`${newGuild.region}\`` : ``,
            oldGuild.icon !== newGuild.icon ? `Icon: [url](${oldGuild.icon}) **➜** [url](${newGuild.icon})` : ``,
            oldGuild.ownerID !== newGuild.ownerID ? `ownerID: \`${oldGuild.ownerID}\` **➜** \`${newGuild.AuditLogEventownerID}\`` : ``,
            oldGuild.verificationLevel !== newGuild.verificationLevel ? `Verification Level: \`${oldGuild.verificationLevel}\` **➜** \`${newGuild.ownerID}\`` : ``,
            oldGuild.systemChannelID !== newGuild.systemChannelID ? `systemChannelID: \`${oldGuild.systemChannelID}\` **➜** \`${newGuild.systemChannelID}\`` : ``,
            oldGuild.afkChannelID !== newGuild.afkChannelID ? `afkChannelID: \`${oldGuild.afkChannelID}\` **➜** \`${newGuild.afkChannelID}\`` : ``,
            oldGuild.afkTimeout !== newGuild.afkTimeout ? `afkChannelID: \`${oldGuild.afkTimeout}\` **➜** \`${newGuild.afkTimeout}\`` : ``,
            oldGuild.defaultMessageNotifications !== newGuild.defaultMessageNotifications ? `defaultMessageNotifications: \`${oldGuild.defaultMessageNotifications}\` **➜** \`${newGuild.defaultMessageNotifications}\`` : ``,
            `\n\n<:MOD:836168687891382312> **Executor:** ${executor.tag}\n<a:Right:877975111846731847> **At:** <t:${timestamp}>`
        ].join(' '))
        .setColor('#2F3136')
        .setFooter({ text: oldGuild.name, iconURL: oldGuild.iconURL({dynamic: true}) })
        .setTimestamp()



        const botname = client.user.username;
        const webhooks = await Channel.fetchWebhooks()
        logs.push(GuildUpdate)
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