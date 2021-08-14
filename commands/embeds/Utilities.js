const discord = require('discord.js');

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    if (message.channel.type === "dm") return;
    if (!message.guild.me.permissions.has("SEND_MESSAGES") || !message.guild.me.permissions.has("EMBED_LINKS") || !message.guild.me.permissions.has("USE_EXTERNAL_EMOJIS") || !message.guild.me.permissions.has("ADD_REACTIONS") || !message.guild.me.permissions.has("VIEW_CHANNEL") || !message.guild.me.permissions.has("ATTACH_FILES") || !message.guild.me.permissions.has("READ_MESSAGE_HISTORY") || !message.guild.me.permissions.has("READ_MESSAGE_HISTORY")) return;
    const Utl = new discord.MessageEmbed()
    .setColor('738ADB')
    .setTitle('<a:pp350:836168684379701279> Utilities Commands')
    .setURL('https://Wolfy.yoyojoe.repl.co')
    .setAuthor(Client.user.username, Client.user.displayAvatarURL())
    .setThumbnail(Client.user.displayAvatarURL())
    .addFields(
        { name: `${prefix}suggestion`, value: `> \`Send your suggestion for the server\``},
        { name: `${prefix}ping`, value: `> \`Shows the bot ping\``},
        { name: `${prefix}remind`, value: `> \`The bot will reminde you for anything\``},
        { name: `${prefix}report`, value: `> \`To report someone in the server\``},
        { name: `${prefix}calculator`, value: `> \`To send the calculator\``},
        { name: `${prefix}yt`, value: `> \`Start new youtube together party\``}
    )
    message.channel.send(Utl);

}

    

module.exports.help = {
    name: "helpUtilities",
    aliases: ['Help-Utilities', 'helpUtl', 'helputl']
}