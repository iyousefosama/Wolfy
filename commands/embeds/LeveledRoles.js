const discord = require('discord.js');
const { prefix } = require('../../config.json');

module.exports = {
    name: "helplevel",
    aliases: ["HelpLevel", "HELPLEVEL", "help-level", "helpleveledroles", "HelpLeveledRoles"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    group: 'Help Embeds',
    description: 'Display leveledRoles commands helplist.',
    cooldown: 10, //seconds(s)
    guarded: false, //or false
    permissions: [],
    clientpermissions: ["USE_EXTERNAL_EMOJIS", "EMBED_LINKS", "ATTACH_FILES", "VIEW_CHANNEL"],
    examples: [''],
    async execute(client, message, args) {
    const level = new discord.MessageEmbed()
    .setColor('738ADB')
    .setTitle('<a:Up:853495519455215627> **LeveledRoles Commands**')
    .setURL('https://Wolfy.yoyojoe.repl.co')
    .setThumbnail(client.user.displayAvatarURL())
    .addFields(
        { name: `${prefix}leveltoggle`, value: `> \`To enable/disable levelRoles cmd\``},
        { name: `${prefix}rank`, value: `> \`Show your level & rank and your current and next xp\``},
        { name: `${prefix}level-roles`, value: `> \`To show you all level roles in the guild\``},
        { name: `${prefix}add-role`, value: `> \`Add a level role as a prize for users when they be active\``},
        { name: `${prefix}edit-level-role`, value: `> \`Edit the guild level role to another one\``},
        { name: `${prefix}clearxp`, value: `> \`Clear the xp for a user in the server\``},
        { name: `${prefix}remove-role`, value: `> \`Remove a level role from the list\``}
    )
    .setFooter(client.user.username, client.user.displayAvatarURL())
    .setTimestamp()
    
    
    message.channel.send({embeds: [level]});
    }
}