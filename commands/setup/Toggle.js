const Discord = require('discord.js');
const schema = require('../../schema/GuildSchema')
const { prefix } = require('../../config.json');

module.exports = {
    name: "toggle",
    aliases: ["Toggle"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<Type> <off/on>',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    permissions: ["MANAGE_CHANNELS", "ADMINISTRATOR"],
    clientpermissions: ["MANAGE_CHANNELS", "ADMINISTRATOR"],
    async execute(client, message, [cmd = '', ...ifEnabled] ) {

        let data;
        try{
            data = await schema.findOne({
                GuildID: message.guild.id
            })
            if(!data) {
                return message.channel.send({ content: `\\❌ **${message.member.displayName}**, You didn't set channel yet!`})
            }
        } catch(err) {
            console.log(err)
            message.channel.send({ content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`})
        }
        if(cmd == 'suggestions', 'Suggestions' && ifEnabled == 'off') {
            data.ToggleSuggestionChannel = false
            await data.save()
            message.channel.send({ content: `\\✔️ Successfully set the suggestions channel to off!`})
        } else if(cmd == 'suggestions', 'Suggestions' && ifEnabled == 'on') {
            data.ToggleSuggestionChannel = true
            await data.save()
            message.channel.send({ content: `\\✔️ Successfully set the suggestions channel to on!`})
        } else if(cmd == 'reports', 'Reports' && ifEnabled == 'off') {
            data.ToggleReportsChannel = false
            await data.save()
            message.channel.send({ content: `\\✔️ Successfully set the reports channel to off!`})
        } else if(cmd == 'reports', 'Reports' && ifEnabled == 'on') {
            data.ToggleReportsChannel = true
            await data.save()
            message.channel.send({ content: `\\✔️ Successfully set the reports channel to on!`})
        } else if(cmd == 'logs', 'Logs' && ifEnabled == 'off') {
            data.ToggleLogsChannel = false
            await data.save()
            message.channel.send({ content: `\\✔️ Successfully set the suggestions channel to off!`})
        } else if(cmd == 'logs', 'Logs' && ifEnabled == 'on') {
            data.ToggleLogsChannel = true
            await data.save()
            message.channel.send({ content: `\\✔️ Successfully set the suggestions channel to on!`})
        } else {
            message.channel.send({ content: `\\❌ **${message.member.displayName}**, Wrong usage or the cmd already <on/off>!\n Example: \`${prefix}toggle logs off/on\`` })
        }
}
}