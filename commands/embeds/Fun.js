const discord = require('discord.js');

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    const Fun = new discord.MessageEmbed()
    .setColor('RANDOM')
    .setTitle('**Fun help list**')
    .setThumbnail(Client.user.displayAvatarURL())
    .setImage('https://cdn.discordapp.com/attachments/804847293118808074/808859216064413716/Line.gif')
    .addFields(
        { name: `${prefix}8ball`, value: `> \`Ask the 8ball anything and it will answer\``},
        { name: `${prefix}bed`, value: `> \`Fun bed command\``},
        { name: `${prefix}clyed`, value: `> \`Send your message as clyed text message\``},
        { name: `${prefix}cookie`, value: `> \`Give a cookie for a user\``},
        { name: `${prefix}fastTyper`, value: `> \`Start playing fastTyper game\``},
        { name: `${prefix}meme`, value: `> \`Gives random memes\``},
        { name: `${prefix}remind`, value: `> \`The bot will reminde you for anything\``},
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
    aliases: ['Fun', 'help-fun']
}