const Discord = require('discord.js');
const schema = require('../../schema/GuildSchema')
const { prefix } = require('../../config.json');

module.exports = {
    name: "set",
    aliases: ["Set"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<Type> <channelID>',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    permissions: ["MANAGE_CHANNELS", "ADMINISTRATOR"],
    clientpermissions: ["MANAGE_CHANNELS", "ADMINISTRATOR"],
    async execute(client, message, [Type = '', ChannelID] ) {

        channel = message.guild.channels.cache.get(ChannelID);
      
        if (!channel || channel.type !== 'GUILD_TEXT'){
          return message.channel.send(`\\❌ **${message.member.displayName}**, please provide a valid channel ID.`);
        } else if (!channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')){
          return message.channel.send(`\\❌ **${message.member.displayName}**, I need you to give me permission to send messages on ${channel} and try again.`);
        } else if (!channel.permissionsFor(message.guild.me).has('EMBED_LINKS')){
          return message.channel.send(`\\❌ **${message.member.displayName}**, I need you to give me permission to embed links on ${channel} and try again.`);
        };

        let data;
        try{
            data = await schema.findOne({
                GuildID: message.guild.id
            })
            if(!data) {
                data = await schema.create({
                    GuildID: message.guild.id
                })
                }
        } catch(err) {
            console.log(err)
            message.channel.send({ content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`})
        }
        if(Type == 'suggestions', 'Suggestions' && ChannelID == ChannelID) {
            data.SuggestionChannel = ChannelID
            await data.save()
            message.channel.send({ content: `\\✔️ Successfully set the suggestions channel to <#${ChannelID}>!`})
            if(data.ToggleSuggestionChannel = false) return message.channel.send({ content: `\\❌ Suggestions command is disabled in this server!`})
        } else if(Type == 'reports', 'Reports' && ChannelID == ChannelID) {
            data.ReportsChannel = ChannelID
            await data.save()
            message.channel.send({ content: `\\✔️ Successfully set the reports channel to <#${ChannelID}>!`})
            if(data.ToggleReportsChannel = false) return message.channel.send({ content: `\\❌ Reports command is disabled in this server!`})
        } else if(Type == 'logs', 'Logs' && ChannelID == ChannelID) {
            data.LogsChannel = ChannelID
            await data.save()
            message.channel.send({ content: `\\✔️ Successfully set the logs channel to <#${ChannelID}>!`})
            if(data.ToggleReportsChannel = false) return message.channel.send({ content: `\\❌ Reports command is disabled in this server!`})
        } else {
            message.channel.send({ content: `\\❌ **${message.member.displayName}**, Wrong usage!\n \`Example: ${prefix}set suggestions <channelID>\`` })
        }
}
}