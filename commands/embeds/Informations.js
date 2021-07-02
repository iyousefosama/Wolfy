const discord = require('discord.js');

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    if (message.channel.type === "dm") return;
    const info = new discord.MessageEmbed()
    .setColor('738ADB')
    .setTitle(`<a:UltraPin:836169056926564362> Informations Commands`)
    .setURL('http://wolfy.tk/')
    .setAuthor(Client.user.username, Client.user.displayAvatarURL())
    .setImage('https://cdn.discordapp.com/attachments/804847293118808074/808859216064413716/Line.gif')
    .setThumbnail(Client.user.displayAvatarURL())
    .addFields(
        { name: `${prefix}server`, value: `> \`Shows informations about a server\``},
        { name: `${prefix}bot`, value: `> \`Shows informations about the bot\``},
        { name: `${prefix}user`, value: `> \`Shows informations about a user\``},
        { name: `${prefix}avatar`, value: `> \`Get a user's avatar.\``},
        { name: `${prefix}savatar`, value: `> \`Get a server's avatar.\``},
        { name: `${prefix}findid`, value: `> \`Get a user's id.\``},
        { name: `${prefix}invite`, value: `> \`To see your invites count\``},
        { name: `${prefix}uptime`, value: `> \`Show you the bot uptime\``}
    )
    
    
    message.channel.send(info);

}

    

module.exports.help = {
    name: "helpInfo",
    aliases: ['help-informations', 'information', 'helpinfo']
}