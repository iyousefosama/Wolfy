const discord = require('discord.js');
const { prefix } = require('../../config.json');

module.exports = {
    name: "helpticket",
    aliases: ["Helpticket", "HELPTICKET", "help-ticket"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    group: 'Help Embeds',
    description: 'Display ticket commands helplist.',
    cooldown: 10, //seconds(s)
    guarded: false, //or false
    permissions: [],
    clientpermissions: ["USE_EXTERNAL_EMOJIS", "EMBED_LINKS", "ATTACH_FILES", "VIEW_CHANNEL"],
    examples: [''],
    async execute(client, message, args) {
    const ticket = new discord.MessageEmbed()
    .setColor('738ADB')
    .setTitle('🎫 **Ticket help list**\n\`Note: you must add category with name TICKETS\`')
    .setURL('https://Wolfy.yoyojoe.repl.co')
    .setThumbnail(client.user.displayAvatarURL())
    .addFields(
        { name: `${prefix}ticket`, value: `> \`Open new ticket in the server\``},
        { name: `${prefix}rename`, value: `> \`Change ticket name\``},
        { name: `${prefix}delete`, value: `> \`Delete your ticket in the server\``}
    )
    .setFooter(client.user.username, client.user.displayAvatarURL())
    .setTimestamp()
    message.channel.send({embeds: [ticket]});
    }
}