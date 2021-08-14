const discord = require('discord.js');

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    if (message.channel.type === "dm") return;
    if(!message.guild.me.permissions.has('SEND_MESSAGES')) return;
    const Fun = new discord.MessageEmbed()
    .setColor('738ADB')
    .setTitle('<a:pp434:836168673755660290> **Fun Commands**')
    .setURL('https://Wolfy.yoyojoe.repl.co')
    .setThumbnail(Client.user.displayAvatarURL())
    .addFields(
        { name: `${prefix}8ball`, value: `> \`Ask the 8ball anything and it will answer\``},
        { name: `${prefix}clyed`, value: `> \`Send your message as clyed text message\``},
        { name: `${prefix}cookie`, value: `> \`Give a cookie for a user\``},
        { name: `${prefix}fastTyper`, value: `> \`Start playing fastTyper game\``},
        { name: `${prefix}guess`, value: `> \`Play guess the number game\``},
        { name: `${prefix}meme`, value: `> \`Gives random memes\``},
        { name: `${prefix}rpc`, value: `> \`Playing rock/paper/scissors vs the bot\``},
        { name: `${prefix}tweet`, value: `> \`Send your message as tweet message\``},
        { name: `${prefix}waterdrop`, value: `> \`Start playing waterdrop game\``}
    )
    .setFooter(Client.user.username, Client.user.displayAvatarURL())
    .setTimestamp()
    
    
    message.channel.send(Fun);

}

    

module.exports.help = {
    name: "helpfun",
    aliases: ['helpFun', 'help-fun']
}