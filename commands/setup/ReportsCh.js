const Discord = require('discord.js');
const schema = require('../../schema/GuildSchema')

module.exports = {
    name: "setreportch",
    aliases: ["SetReportCh", "SETREPORTCH", "setReportch", "setreportchannel"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '<channelID>',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    permissions: ["MANAGE_CHANNELS", "ADMINISTRATOR"],
    clientpermissions: ["MANAGE_CHANNELS", "ADMINISTRATOR"],
    async execute(client, message, args) {
      
          const channelID = args[0];
          channel = message.guild.channels.cache.get(channelID);
      
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
            message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`)
        }
        if(data.ReportsChannel == channelID) {
          message.channel.send({ content: `\\❌ **${message.member.displayName}**, Reports channel already set in ${channel}.`})
        } else if(data.ToggleReportsChannel == false) {
          message.channel.send({ content: `\\❌ **${message.member.displayName}**, Report cmd is disabled to enable it use \`${prefix}toggle logs on\`.`})
        } else {
        data.ReportsChannel = channelID
        data.save()
        message.channel.send(`\\✔️ Successfully set the reports channel to ${channel}!`)
        }
}
}