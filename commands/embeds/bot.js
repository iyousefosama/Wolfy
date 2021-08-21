const discord = require('discord.js');
const { prefix } = require('../../config.json');

module.exports = {
    name: "helpbot",
    aliases: ["Helpbot", "HELPBOT", "help-bot"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    cooldown: 10, //seconds(s)
    guarded: false, //or false
    clientpermissions: ["USE_EXTERNAL_EMOJIS", "EMBED_LINKS", "ATTACH_FILES", "VIEW_CHANNEL"],
    async execute(client, message, args) {
    const bot = new discord.MessageEmbed()
    .setColor('738ADB')
    .setTitle('<:Bot:841711382739157043> **Bot Commands**')
    .setURL('https://Wolfy.yoyojoe.repl.co')
    .setThumbnail(client.user.displayAvatarURL())
    .addFields(
        { name: `${prefix}stats`, value: `> \`Show bot stats and informations\``},
        { name: `${prefix}feedback`, value: `> \`To give a feedback about bot or to report bug\``},
        { name: `${prefix}ping`, value: `> \`Shows the bot ping\``},
        { name: `${prefix}uptime`, value: `> \`Show the bot uptime\``}
    )
    .setFooter(client.user.username, client.user.displayAvatarURL())
    .setTimestamp()
    message.channel.send(bot);
    }
}