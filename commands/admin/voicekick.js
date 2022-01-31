const discord = require('discord.js');

module.exports = {
    name: "kickvoice",
    aliases: ["KickVoice", "KICKVOICE"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    group: 'Moderation',
    description: 'Kicks all user in the voice channel!',
    cooldown: 2, //seconds(s)
    guarded: false, //or false
    permissions: ["MOVE_MEMBERS"],
    clientpermissions: ["MOVE_MEMBERS"],
    examples: [],
    async execute(client, message, args) {
        let channel = message.member.voice.channel;
        if(!channel) {
            return message.channel.send(`\\❌ | ${message.author}, Could not found the voice channel!`)
        } else if(!channel.members) {
            return message.channel.send(`\\❌ | ${message.author}, Could not found any members in this channel!`)
        }

        for (let member of channel.members) {
            await new Promise(r=>setTimeout(r,500))
            member[1].voice.setChannel(null)
        }

        return message.channel.send(`\\✔️ ${message.author}, Successfully kicked all members in this \`voice channel\`!`)
}
}