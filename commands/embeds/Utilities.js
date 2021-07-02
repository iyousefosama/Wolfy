const discord = require('discord.js');

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    if (message.channel.type === "dm") return;
    const Utl = new discord.MessageEmbed()
    .setColor('738ADB')
    .setTitle('<a:pp350:836168684379701279> Utilities Commands')
    .setURL('http://wolfy.tk/')
    .setAuthor(Client.user.username, Client.user.displayAvatarURL())
    .setThumbnail(Client.user.displayAvatarURL())
    .setImage('https://cdn.discordapp.com/attachments/804847293118808074/808859216064413716/Line.gif')
    .addFields(
        { name: `${prefix}suggestion`, value: `> \`Send your suggestion for the server\``},
        { name: `${prefix}ping`, value: `> \`Shows the bot ping\``},
        { name: `${prefix}remind`, value: `> \`The bot will reminde you for anything\``},
        { name: `${prefix}report`, value: `> \`To report someone in the server\``},
        { name: `${prefix}calc`, value: `> \`To calculate any thing in math\``},
        { name: `${prefix}yt`, value: `> \`Start new youtube together party\``}
    )
    message.channel.send(Utl);

}

    

module.exports.help = {
    name: "helpUtilities",
    aliases: ['Help-Utilities', 'helpUtl', 'helputl']
}