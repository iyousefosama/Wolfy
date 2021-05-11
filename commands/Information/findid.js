const discord = require('discord.js');

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
  
        var user = message.mentions.users.first() || message.author
        let avatar = user.displayAvatarURL()
     
    const embed = new discord.MessageEmbed()
    .setColor("RANDOM")
    .setAuthor(`Requested by ${message.author.username}`, message.author.displayAvatarURL())
    .setThumbnail(avatar)
    .setDescription(`**ID USER:** ${user.id}`)
    .setTimestamp()
    message.channel.send(embed);
    
}

module.exports.help = {
    name: "findid",
    aliases: ['Findid']
}