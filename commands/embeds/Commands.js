const discord = require('discord.js');

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    const Commands = new discord.MessageEmbed()
    .setColor('RANDOM')
    .setTitle('**Commands help list**')
    .setThumbnail(Client.user.displayAvatarURL())
    .setImage('https://cdn.discordapp.com/attachments/804847293118808074/808859216064413716/Line.gif')
    .addFields(
        { name: `${prefix}server`, value: `> \`Shows informations about a server\``},
        { name: `${prefix}bot`, value: `> \`Shows informations about the bot\``},
        { name: `${prefix}user`, value: `> \`Shows informations about a user\``},
        { name: `${prefix}avatar`, value: `> \`Get a user's avatar.\``},
        { name: `${prefix}savatar`, value: `> \`Get a server's avatar.\``},
        { name: `${prefix}botinv`, value: `> \`Get the bot invite to add it to the server\``},
        { name: `${prefix}covid`, value: `> \`Shows informations about covid in any country\``},
        { name: `${prefix}djs`, value: `> \`Searching for anthing in djs library\``},
        { name: `${prefix}wikipedia`, value: `> \`To search for anything in wikipedia\``},
        { name: `${prefix}findid`, value: `> \`Get a user's id.\``},
        { name: `${prefix}suggestion`, value: `> \`Send your suggestion for the server\``},
        { name: `${prefix}invite`, value: `> \`Generat for new invite for a server\``},
        { name: `${prefix}ping`, value: `> \`Shows the bot ping\``},
        { name: `${prefix}weather`, value: `> \`Shows the weather status in any country\``},
        { name: `${prefix}report`, value: `> \`To report someone in the server\``},
        { name: `${prefix}uptime`, value: `> \`Show you the bot uptime\``},
        { name: `${prefix}calc`, value: `> \`To calculate any thing in math\``},
        { name: `${prefix}setprefix`, value: `> \`set a new prefix for the server\``}
    )
    .setFooter(Client.user.username, Client.user.displayAvatarURL())
    .setTimestamp()
    
    
    message.channel.send(Commands);

}

    

module.exports.help = {
    name: "helpcmd",
    aliases: ['helpCommands', 'help-commands']
}