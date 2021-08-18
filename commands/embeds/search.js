const discord = require('discord.js');
const { prefix } = require('../../config.json');

module.exports = {
    name: "helpsearch",
    aliases: ["HelpSearch", "HELPSEARCH"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    cooldown: 10, //seconds(s)
    guarded: false, //or false
    clientpermissions: ["USE_EXTERNAL_EMOJIS", "EMBED_LINKS", "ATTACH_FILES", "VIEW_CHANNEL"],
    async execute(client, message, args) {
    const search = new discord.MessageEmbed()
    .setColor('738ADB')
    .setTitle('<a:Search:845681277922967572> Search Commands')
    .setURL('https://Wolfy.yoyojoe.repl.co')
    .setAuthor(client.user.username, client.user.displayAvatarURL())
    .setThumbnail(client.user.displayAvatarURL())
    .addFields(
        { name: `${prefix}covid`, value: `> \`Shows informations about covid in any country\``},
        { name: `${prefix}djs`, value: `> \`Searching for anthing in djs library\``},
        { name: `${prefix}wikipedia`, value: `> \`To search for anything in wikipedia\``},
        { name: `${prefix}steam`, value: `> \`To search for any game information in steam\``},
        { name: `${prefix}mcuser`, value: `> \`To get Mincraft user informations\``},
        { name: `${prefix}weather`, value: `> \`Shows the weather status in any country\``},
        { name: `${prefix}rank`, value: `> \`Show your level & rank and your current and next xp\``},
        { name: `${prefix}lyrics`, value: `> \`The bot will show you the lyrics for the music you are searching for!\``}
    )
    
    
    message.channel.send(search);
    }
}