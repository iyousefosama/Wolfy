const discord = require('discord.js'); // requiring discord modules
const moment = require(`moment`) // requiring moment

module.exports.run = async (Client, message, args, prefix) => { // 4 my cmds handler
    if(!message.content.startsWith(prefix)) return; // check if the cmd start with the prefix
    if(!message.guild.me.permissions.has('SEND_MESSAGES', 'EMBED_LINKS', 'USE_EXTERNAL_EMOJIS')) return;
    var botEmbed = new discord.MessageEmbed() // creates a embed that we gonna call botEmbed
    .setColor('738ADB') // will set the color for the embed
    .setAuthor(Client.user.username, Client.user.displayAvatarURL(({dynamic: true, format: 'png', size: 512})))
    .setTitle(`${Client.user.username} Bot's Info`) // make the title for the cmd
    .setURL(`https://Wolfy.yoyojoe.repl.co`)
    .setThumbnail(Client.user.displayAvatarURL()) // it will put the bot avatar (pfp) in the embed
    .setImage(`https://cdn.discordapp.com/attachments/830926767728492565/874773027177512960/c7d26cb2902f21277d32ad03e7a21139.gif`)
    .addField(`**General**`, [ // say general then...
        `<:Bot:841711382739157043> **Username:** ${Client.user.username}`, // this will be the username of the bot
        `<a:pp224:853495450111967253> **Tag:** ${Client.user.tag}`, // the actual name for the bot
        `<:pp198:853494893439352842> **ID:** ${Client.user.id}`, // this will be the ID for the bot
        `📆 **Created At:** ${moment(Client.user.createdAt).format("DD-MM-YYYY [at] HH:mm")}`, // this will say when the bot is created 
        `<:Developer:841321892060201021> **Developer:** <@829819269806030879>`, // who created the bot
        `<:pp228:836168687891382312> **Tester:** <@711042494187438153>`,
        `<a:LightUp:776670894126006302> **Bot Website:** https://Wolfy.yoyojoe.repl.co`,
        '\u200b'
    ])
    .addField(`**Stats**`,[ // it will say stats then...
        `<a:pp594:768866151827767386> **Servers:**\n \`\`\`${Client.guilds.cache.size}\`\`\``, // how many servers the bot is in
        `⌨️ **Channels:**\n \`\`\`${Client.channels.cache.size}\`\`\``, // how many channels the bot have access to
        `<:pp833:853495153280155668> **Users:**\n \`\`\`${Client.users.cache.size}\`\`\``, // how many users the bot serve on
        ])
    message.channel.send(botEmbed)
}
module.exports.help = { // 5 my cmds handler
    name: "botinfo", // name of the cmd
    aliases: ['bot', 'Botinfo'] // another name for the bot
}