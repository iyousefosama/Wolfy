const discord = require('discord.js');
const { prefix } = require('../../config.json');

module.exports = {
    name: "helpinfo",
    aliases: ["HelpInfo", "HELPINFO", "help-information"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    cooldown: 10, //seconds(s)
    guarded: false, //or false
    clientpermissions: ["USE_EXTERNAL_EMOJIS", "EMBED_LINKS", "ATTACH_FILES", "VIEW_CHANNEL"],
    async execute(client, message, args) {
    const info = new discord.MessageEmbed()
    .setColor('738ADB')
    .setTitle(`<a:BackPag:776670895371714570> Informations Commands`)
    .setURL('https://Wolfy.yoyojoe.repl.co')
    .setAuthor(client.user.username, client.user.displayAvatarURL())
    .setThumbnail(client.user.displayAvatarURL())
    .addFields(
        { name: `${prefix}server`, value: `> \`Shows informations about a server\``},
        { name: `${prefix}user`, value: `> \`Shows informations about a user\``},
        { name: `${prefix}avatar`, value: `> \`Get a user's avatar.\``},
        { name: `${prefix}savatar`, value: `> \`Get a server's avatar.\``},
        { name: `${prefix}invite`, value: `> \`To see your invites count\``},
        { name: `${prefix}level-roles`, value: `> \`To show you all level roles in the guild\``},
        { name: `${prefix}rank`, value: `> \`Show your level & rank and your current and next xp\``},
    )
    
    
    message.channel.send(info);
    }
}
