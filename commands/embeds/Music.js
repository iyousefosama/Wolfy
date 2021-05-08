const discord = require('discord.js');

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    const moderator = new discord.MessageEmbed()
    .setColor('RANDOM')
    .setTitle('**Music help list**')
    .setThumbnail(Client.user.displayAvatarURL())
    .setImage('https://cdn.discordapp.com/attachments/804847293118808074/808859216064413716/Line.gif')
    .addFields(
        { name: `${prefix}play`, value: `> \`To play the music.\``},
        { name: `${prefix}pause`, value: `> \`Pause the music for a certain time.\``},
        { name: `${prefix}resume`, value: `> \`Resume the current music\``},
        { name: `${prefix}queue`, value: `> \`Put the mysuc on queue\``},
        { name: `${prefix}clear-queue`, value: `> \`clear the server music queue\``},
        { name: `${prefix}volume`, value: `> \`Increase or reduce the music volume\``},
        { name: `${prefix}skip`, value: `> \`skip current playing music.\``},
        { name: `${prefix}stop`, value: `> \`stop the current playing music\``}
    )
    .setFooter(Client.user.username, Client.user.displayAvatarURL())
    .setTimestamp()
    
    
    message.channel.send(moderator);

}

    

module.exports.help = {
    name: "9654.4189.4162941.4194.4915",
    aliases: []
}