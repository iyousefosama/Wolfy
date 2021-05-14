const discord = require('discord.js');

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    const ticket = new discord.MessageEmbed()
    .setColor('RANDOM')
    .setTitle('**Ticket help list**\n\`Note: you must add category with name TICKETS\`')
    .setThumbnail(Client.user.displayAvatarURL())
    .setImage('https://cdn.discordapp.com/attachments/804847293118808074/808859216064413716/Line.gif')
    .addFields(
        { name: `${prefix}ticket`, value: `> \`Open new ticket in the server\``},
        { name: `${prefix}rename`, value: `> \`Change ticket name\``},
        { name: `${prefix}delete`, value: `> \`Delete your ticket in the server\``}
    )
    .setFooter(Client.user.username, Client.user.displayAvatarURL())
    .setTimestamp()
    
    
    message.channel.send(ticket);

}

    

module.exports.help = {
    name: "helpticket",
    aliases: ['Helpticket', 'help-ticket', 'helpTicket']
}