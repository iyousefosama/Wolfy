const discord = require('discord.js');

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    const moderator = new discord.MessageEmbed()
    .setColor('738ADB')
    .setTitle('<:Rules:840126839938482217> Moderator Commands')
    .setURL('https://discord.js.org/')
    .setThumbnail(Client.user.displayAvatarURL())
    .setImage('https://cdn.discordapp.com/attachments/804847293118808074/808859216064413716/Line.gif')
    .addFields(
        { name: `${prefix}ban`, value: `> \`Bans a member from the server\``},
        { name: `${prefix}unban`, value: `> \`unBans a member from the server\``},
        { name: `${prefix}kick`, value: `> \`Kick a member from the server\``},
        { name: `${prefix}dm`, value: `> \`Dms someone in the server with message\``},
        { name: `${prefix}say`, value: `> \`The bot will repeat what you say\``},
        { name: `${prefix}embed`, value: `> \`The bot will repeat what you say with embed\``},
        { name: `${prefix}nick`, value: `> \`Changes the nickname of a member\``},
        { name: `${prefix}slowmo`, value: `> \`Adding slowmotion chat to a channel\``},
        { name: `${prefix}nuke`, value: `> \`Nuke any channel (this will delete all the channel and create newone!)\``},
        { name: `${prefix}unlock`, value: `> \`Unlock the permissions for @everyone from talking in the channel\``},
        { name: `${prefix}lock`, value: `> \`Lock the permissions for @everyone from talking in the channel\``},
        { name: `${prefix}unlock`, value: `> \`Unlock the permissions for @everyone from talking in the channel\``}
    )
    .setFooter(Client.user.username, Client.user.displayAvatarURL())
    .setTimestamp()
    message.channel.send(moderator);
    if (args[0] =="mod" || args[0] == "Mode") return

}

    

module.exports.help = {
    name: "helpmod",
    aliases: ['helpModerator', 'help-moderator', 'helpMod']
}