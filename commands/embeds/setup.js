const discord = require('discord.js');
const { prefix } = require('../../config.json');

module.exports = {
    name: "helpsetup",
    aliases: ["HelpSetup", "HELPSETUP"],
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
    .setTitle('<:MOD:836168687891382312> Setup Commands')
    .setURL('https://Wolfy.yoyojoe.repl.co')
    .setAuthor(client.user.username, client.user.displayAvatarURL())
    .setThumbnail(client.user.displayAvatarURL())
    .addFields(
        { name: `${prefix}setLogsch`, value: `> \`Setup the logs channel bot will send logs there!\``},
        { name: `${prefix}setReportch`, value: `> \`Setup the reports channel bot will send reports from users there!\``},
        { name: `${prefix}setSuggch`, value: `> \`Setup the suggestion channel bot will send suggestions from users there!\``}
    )
    
    
    message.channel.send({embeds: [search]});
    }
}