const discord = require('discord.js');

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    const help = new discord.MessageEmbed()
    .setColor('RANDOM')
    .setAuthor(Client.user.username, Client.user.displayAvatarURL())
    .setThumbnail(Client.user.displayAvatarURL())
    .addFields(
        { name: 'informations helplist', value: `\`\`\`${prefix}helpinfo\`\`\``, inline: true},
        { name: 'Search helplist', value: `\`\`\`${prefix}helpsearch\`\`\``, inline: true},
        { name: 'Utilities helplist', value: `\`\`\`${prefix}helpUtl\`\`\``, inline: true},
        { name: 'Moderator helplist', value: `\`\`\`${prefix}helpmod\`\`\``, inline: true},
        { name: 'Ticket helplist', value: `\`\`\`${prefix}helpticket\`\`\``, inline: true},
        { name: 'Fun helplist', value: `\`\`\`${prefix}helpfun\`\`\``, inline: true}
    )
    
    
    message.channel.send(help);

}

    

module.exports.help = {
    name: "help",
    aliases: ['Help']
}