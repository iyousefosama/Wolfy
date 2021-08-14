const discord = require('discord.js');

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    if (!message.guild.me.permissions.has("SEND_MESSAGES") || !message.guild.me.permissions.has("EMBED_LINKS") || !message.guild.me.permissions.has("USE_EXTERNAL_EMOJIS") || !message.guild.me.permissions.has("ADD_REACTIONS") || !message.guild.me.permissions.has("VIEW_CHANNEL") || !message.guild.me.permissions.has("ATTACH_FILES") || !message.guild.me.permissions.has("READ_MESSAGE_HISTORY") || !message.guild.me.permissions.has("READ_MESSAGE_HISTORY")) return;
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