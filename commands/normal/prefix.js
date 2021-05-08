const discord = require('discord.js');

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
const prefixembed = new discord.MessageEmbed()
    .setColor("RANDOM")
    .setAuthor(Client.user.displayAvatarURL(), `The current prefix is ${prefix}`)

message.channel.send(prefixembed);
}

    

module.exports.help = {
    name: "prefix",
    aliases: ['Prefix']
}