const discord = require('discord.js');
const { prefix } = require('../../config.json');

module.exports = {
    name: "helpmod",
    aliases: ["HelpMod", "HELPMOD", "help-moderator", "HELP-MODERATOR"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    group: 'Help Embeds',
    description: 'Display Moderator commands helplist.',
    cooldown: 10, //seconds(s)
    guarded: false, //or false
    permissions: [],
    clientpermissions: ["USE_EXTERNAL_EMOJIS", "EMBED_LINKS", "ATTACH_FILES", "VIEW_CHANNEL"],
    examples: [''],
    async execute(client, message, args) {
    const moderator = new discord.MessageEmbed()
    .setColor('738ADB')
    .setTitle('<a:pp989:853496185443319809> Moderator Commands')
    .setURL('https://Wolfy.yoyojoe.repl.co')
    .setThumbnail(client.user.displayAvatarURL())
    .addFields(
        { name: `${prefix}ban`, value: `> \`Bans a member from the server\``},
        { name: `${prefix}softban`, value: `> \`Kicks a user and deletes all their messages in the past 7 days\``},
        { name: `${prefix}hackban`, value: `> \`Bans a member not in the server\``},
        { name: `${prefix}unban`, value: `> \`unBans a member from the server\``},
        { name: `${prefix}kick`, value: `> \`Kick a member from the server\``},
        { name: `${prefix}dm`, value: `> \`Dms someone in the server with message\``},
        { name: `${prefix}warn`, value: `> \`Warn a user in the server!\``},
        { name: `${prefix}warnings`, value: `> \`Display the mentioned user warns list and ids\``},
        { name: `${prefix}removewarn`, value: `> \`Remove a user warn from the warns list by the id\``},
        { name: `${prefix}say`, value: `> \`The bot will repeat what you say\``},
        { name: `${prefix}embed`, value: `> \`The bot will repeat what you say with embed\``},
        { name: `${prefix}embedsetup`, value: `> \`Display the setup embed message!\``},
        { name: `${prefix}nick`, value: `> \`Changes the nickname of a member\``},
        { name: `${prefix}slowmo`, value: `> \`Adding slowmotion chat to a channel\``},
        { name: `${prefix}nuke`, value: `> \`Nuke any channel (this will delete all the channel and create newone!)\``},
        { name: `${prefix}mute/unmute`, value: `> \`Mute/Unmute someone from texting!\``},
        { name: `${prefix}lock`, value: `> \`Lock the permissions for @everyone from talking in the channel\``},
        { name: `${prefix}unlock`, value: `> \`Unlock the permissions for @everyone from talking in the channel\``},
        { name: `${prefix}clear`, value: `> \`Clear/Delete message with quantity you want (from 2 to 100)\``}
    )
    .setFooter(client.user.username, client.user.displayAvatarURL())
    .setTimestamp()
    message.channel.send({embeds: [moderator]});
    }
}