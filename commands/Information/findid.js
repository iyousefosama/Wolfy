const discord = require('discord.js');

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    if(!message.member.guild.me.hasPermission([SEND_MESSAGES, EMBED_LINKS, USE_EXTERNAL_EMOJIS])) return;
        var user = message.mentions.users.first() || message.author
        let avatar = user.displayAvatarURL()
     
    const embed = new discord.MessageEmbed()
    .setColor("WHITE")
    .setAuthor(`Requested by ${message.author.username}`, message.author.displayAvatarURL())
    .setThumbnail(avatar)
    .setDescription(`**USER ID:** ${user.id}`)
    .setTimestamp()
    message.channel.send(embed);
    
}

module.exports.help = {
    name: "findid",
    aliases: ['Findid']
}