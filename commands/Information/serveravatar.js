const discord = require('discord.js');

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    if (message.channel.type === "dm") return;
    if (!message.guild.me.permissions.has("SEND_MESSAGES") || !message.guild.me.permissions.has("EMBED_LINKS") || !message.guild.me.permissions.has("USE_EXTERNAL_EMOJIS") || !message.guild.me.permissions.has("ADD_REACTIONS") || !message.guild.me.permissions.has("VIEW_CHANNEL") || !message.guild.me.permissions.has("ATTACH_FILES") || !message.guild.me.permissions.has("READ_MESSAGE_HISTORY") || !message.guild.me.permissions.has("READ_MESSAGE_HISTORY")) return;
    let avatarserver = new discord.MessageEmbed()
    .setColor("RANDOM")
    .setAuthor(message.guild.name, message.guild.iconURL())
    .setTitle("Avatar Link")
    .setURL(message.guild.iconURL())
    .setImage (message.guild.iconURL({dynamic: true, format: 'png', size: 512}))
    .setFooter(`Requested By ${message.author.tag}`, message.author.avatarURL())
    message.channel.send(avatarserver)

}

    

module.exports.help = {
    name: "savatar",
    aliases: ['serveravatar']
}