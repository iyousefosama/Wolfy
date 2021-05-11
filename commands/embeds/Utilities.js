const discord = require('discord.js');

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    const Utl = new discord.MessageEmbed()
    .setColor('RANDOM')
    .setTitle('Utilities Commands')
    .setAuthor(Client.user.username, Client.user.displayAvatarURL())
    .setThumbnail(Client.user.displayAvatarURL())
    .addFields(
        { name: `${prefix}suggestion`, value: `> \`Send your suggestion for the server\``},
        { name: `${prefix}ping`, value: `> \`Shows the bot ping\``},
        { name: `${prefix}report`, value: `> \`To report someone in the server\``},
        { name: `${prefix}calc`, value: `> \`To calculate any thing in math\``}
    )
    
    
    message.channel.send(Utl);

}

    

module.exports.help = {
    name: "helpUtilities",
    aliases: ['Help-Utilities', 'helpUtl']
}