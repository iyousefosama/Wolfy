const discord = require('discord.js'); // requiring discord modules
const moment = require(`moment`) // requiring moment

module.exports.run = async (Client, message, args, prefix) => { // 4 my cmds handler
    if(!message.content.startsWith(prefix)) return; // check if the cmd start with the prefix

    var botEmbed = new discord.MessageEmbed() // creates a embed that we gonna call botEmbed
    .setColor(`RANDOM`) // will set the color for the embed
    .setTitle(`${Client.user.username} Bot's Info`) // make the title for the cmd
    .setThumbnail(Client.user.displayAvatarURL()) // it will put the bot avatar (pfp) in the embed
    .addField(`**General**`, [ // say general then...
        `<a:5449_epingle:743995629004390459> **Username:** ${Client.user.username}`, // this will be the username of the bot
        `<a:pp855:768869639786463242> **Tag:** ${Client.user.tag}`, // the actual name for the bot
        `🆔 **ID:** ${Client.user.id}`, // this will be the ID for the bot
        `📆 **Created At:** ${moment(Client.user.createdAt).format("DD-MM-YYYY [at] HH:mm")}`, // this will say when the bot is created 
        `👑 **Owner:** <@742682490216644619>,<@501431027013517333>`, // who created the bot
        '\u200b'
    ])
    .addField(`**Stats**`,[ // it will say stats then...
        `<a:pp594:768866151827767386> **Servers:** ${Client.guilds.cache.size}`, // how many servers the bot is in
        `⌨️ **Channels:** ${Client.channels.cache.size}`, // how many channels the bot have access to
        `<a:pp17:768866435681878039> **Users:** ${Client.users.cache.size}`, // how many users the bot serve on
        `<a:4448_cat_glitchy:743997440168034336> **Bot version:** 0.01`
        ])
    message.channel.send(botEmbed) // it sends the embed
}
module.exports.help = { // 5 my cmds handler
    name: "botinfo", // name of the cmd
    aliases: ['bot', 'Botinfo'] // another name for the bot
}