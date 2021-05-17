const discord = require('discord.js');

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    if (message.channel.type === "dm") return;
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