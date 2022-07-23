const discord = require('discord.js');

module.exports = {
    name: "voicekick",
    aliases: ["VoiceKick", "Voicekick", "VOICEKICK"],
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
    async execute(client, message, [ member = '', ...args]) {

        const owner = await message.guild.fetchOwner()

        if(member.toLowerCase() == "all") {
            let channel = message.member.voice.channel;
            if(!channel) {
                return message.channel.send(`\\❌ | ${message.author}, Could not found the voice channel!`)
            } else if(!channel.members) {
                return message.channel.send(`\\❌ | ${message.author}, Could not found any members in this channel!`)
            }
    
            for (let member of channel.members) {
                await new Promise(r=>setTimeout(r,500))
                member[1].voice.setChannel(null)
                return message.channel.send(`\\✔️ ${message.author}, Successfully kicked all members in this \`voice channel\`!`)
            }
        }
    
        if (!member.match(/\d{17,19}/)){
          return message.channel.send(`\\❌ | ${message.author}, Please type the id or mention the user/all to kick from the voice.`);
        };
    
        member = await message.guild.members
        .fetch(member.match(/\d{17,19}/)[0])
        .catch(() => null);

        if (!member){
            return message.channel.send(`\\❌ | ${message.author}, User could not be found! Please ensure the supplied ID is valid.`);
          } else if (member.id === message.author.id){
            return message.channel.send(`\\❌ | ${message.author}, You cannot voice kick yourself!`);
          } else if (member.id === client.user.id){
            return message.channel.send(`\\❌ | ${message.author}, You cannot voice kick me!`);
          } else if (member.id === message.guild.ownerId){
            return message.channel.send(`\\❌ | ${message.author}, You cannot voice kick a server owner!`);
          } else if (client.owners.includes(member.id)){
            return message.channel.send(`\\❌ | ${message.author}, You can't voice kick my developer through me!`);
          } else if (message.member.roles.highest.position < member.roles.highest.position){
            return message.channel.send(`\\❌ | ${message.author}, You can't voice kick that user! He/She has a higher role than yours`);
          };

        return message.channel.send(`\\✔️ ${message.author}, Successfully kicked all members in this \`voice channel\`!`)
}
}