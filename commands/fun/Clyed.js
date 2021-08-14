const discord = require('discord.js');
const axios = require('axios');
const { MessageEmbed } = require('discord.js');

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    if (!message.guild.me.permissions.has("SEND_MESSAGES") || !message.guild.me.permissions.has("EMBED_LINKS") || !message.guild.me.permissions.has("USE_EXTERNAL_EMOJIS") || !message.guild.me.permissions.has("ADD_REACTIONS") || !message.guild.me.permissions.has("VIEW_CHANNEL") || !message.guild.me.permissions.has("ATTACH_FILES") || !message.guild.me.permissions.has("READ_MESSAGE_HISTORY") || !message.guild.me.permissions.has("READ_MESSAGE_HISTORY")) return;

    if(!args[0]) return message.channel.send('Please provide some text');
    axios
    .get(`https://nekobot.xyz/api/imagegen?type=clyde&text=${args.join(" ")}`)
    .then((res) => {
        const embed = new MessageEmbed()
        .setImage(res.data.message)
        message.channel.send(embed)
    })
    .catch(err => {
        message.channel.send('<a:Error:836169051310260265> Error!');
      })

}
    

module.exports.help = {
    name: "clyed",
    aliases: ['Clyed']
}