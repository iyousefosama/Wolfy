const discord = require('discord.js');
const { prefix } = require('../../config.json');

module.exports = {
    name: "helpfun",
    aliases: ["HelpFun", "HELPFUN", "help-fun"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    group: 'Help Embeds',
    description: 'Display fun commands helplist.',
    cooldown: 10, //seconds(s)
    guarded: false, //or false
    permissions: [],
    clientpermissions: ["USE_EXTERNAL_EMOJIS", "EMBED_LINKS", "ATTACH_FILES", "VIEW_CHANNEL"],
    examples: [''],
    async execute(client, message, args) {
    const Fun = new discord.MessageEmbed()
    .setColor('738ADB')
    .setTitle('<a:pp434:836168673755660290> **Fun Commands**')
    .setURL('https://Wolfy.yoyojoe.repl.co')
    .setThumbnail(client.user.displayAvatarURL())
    .addFields(
        { name: `${prefix}8ball`, value: `> \`Ask the 8ball anything and it will answer\``},
        { name: `${prefix}clyed`, value: `> \`Send your message as clyed text message\``},
        { name: `${prefix}fastTyper`, value: `> \`Start playing fastTyper game\``},
        { name: `${prefix}meme`, value: `> \`Gives random memes\``},
        { name: `${prefix}rps`, value: `> \`Playing rock/paper/scissors vs the bot\``},
        { name: `${prefix}tweet`, value: `> \`Send your message as tweet message\``},
        { name: `${prefix}reverse`, value: `> \`Reverse the words you want!\``},
        { name: `${prefix}waterdrop`, value: `> \`Start playing waterdrop game\``},
        { name: `${prefix}joke`, value: `> \`The bot will tell you random joke from the api\``},
        { name: `${prefix}roll`, value: `> \`Let\'s flip the coin!\``}
    )
    .setFooter(client.user.username, client.user.displayAvatarURL())
    .setTimestamp()
    
    
    message.channel.send({embeds: [Fun]});
    }
}