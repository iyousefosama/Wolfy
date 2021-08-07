const discord = require('discord.js');

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    if (message.channel.type === "dm") return;
    const search = new discord.MessageEmbed()
    .setColor('738ADB')
    .setTitle('<a:Search:845681277922967572> Search Commands')
    .setURL('https://Wolfy.yoyojoe.repl.co')
    .setAuthor(Client.user.username, Client.user.displayAvatarURL())
    .setThumbnail(Client.user.displayAvatarURL())
    .addFields(
        { name: `${prefix}covid`, value: `> \`Shows informations about covid in any country\``},
        { name: `${prefix}djs`, value: `> \`Searching for anthing in djs library\``},
        { name: `${prefix}wikipedia`, value: `> \`To search for anything in wikipedia\``},
        { name: `${prefix}steam`, value: `> \`To search for any game information in steam\``},
        { name: `${prefix}mcuser`, value: `> \`To get Mincraft user informations\``},
        { name: `${prefix}weather`, value: `> \`Shows the weather status in any country\``},
        { name: `${prefix}lyrics`, value: `> \`The bot will show you the lyrics for the music you are searching for!\``}
    )
    
    
    message.channel.send(search);

}

    

module.exports.help = {
    name: "helpsearch",
    aliases: ['Help-search', 'helpSearch']
}