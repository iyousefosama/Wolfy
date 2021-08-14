const discord = require('discord.js');

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    if (message.channel.type === "dm") return;
    if(!message.member.guild.me.hasPermission(["SEND_MESSAGES", "EMBED_LINKS", "USE_EXTERNAL_EMOJIS"])) return;

    const ticket = new discord.MessageEmbed()
    .setColor('738ADB')
    .setTitle('🎫 **Ticket help list**\n\`Note: you must add category with name TICKETS\`')
    .setURL('https://Wolfy.yoyojoe.repl.co')
    .setThumbnail(Client.user.displayAvatarURL())
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