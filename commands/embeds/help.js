const discord = require('discord.js');
const pagination = require('discord.js-pagination');

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    const help = new discord.MessageEmbed()
    .setColor('738ADB')
    .setTitle(`Hi ${message.author.username}, how can i help you?`)
	.setURL('http://wolfy.tk/')
    .setAuthor(Client.user.username, Client.user.displayAvatarURL())
    .setThumbnail(Client.user.displayAvatarURL())
    .addFields(
        { name: '<a:UltraPin:836169056926564362> informations helplist', value: `\`\`\`${prefix}helpinfo\`\`\``, inline: true},
        { name: '<a:Search:845681277922967572> Search helplist', value: `\`\`\`${prefix}helpsearch\`\`\``, inline: true},
        { name: '<a:pp350:836168684379701279> Utilities helplist', value: `\`\`\`${prefix}helpUtl\`\`\``, inline: true},
        { name: '<a:Enchanted_netherite_sword:758070334879563786> Moderator helplist', value: `\`\`\`${prefix}helpmod\`\`\``, inline: true},
        { name: '🎫 Ticket helplist', value: `\`\`\`${prefix}helpticket\`\`\``, inline: true},
        { name: '<a:pp434:836168673755660290> Fun helplist', value: `\`\`\`${prefix}helpfun\`\`\``, inline: true}
    )
    const info = new discord.MessageEmbed()
    .setColor('738ADB')
    .setTitle(`<a:UltraPin:836169056926564362> Informations Commands`)
    .setURL('http://wolfy.tk/')
    .setAuthor(Client.user.username, Client.user.displayAvatarURL())
    .setThumbnail(Client.user.displayAvatarURL())
    .setImage('https://cdn.discordapp.com/attachments/804847293118808074/808859216064413716/Line.gif')
    .addFields(
        { name: `${prefix}server`, value: `> \`Shows informations about a server\``},
        { name: `${prefix}bot`, value: `> \`Shows informations about the bot\``},
        { name: `${prefix}user`, value: `> \`Shows informations about a user\``},
        { name: `${prefix}avatar`, value: `> \`Get a user's avatar.\``},
        { name: `${prefix}savatar`, value: `> \`Get a server's avatar.\``},
        { name: `${prefix}findid`, value: `> \`Get a user's id.\``},
        { name: `${prefix}invite`, value: `> \`To see your invites count\``},
        { name: `${prefix}uptime`, value: `> \`Show you the bot uptime\``}
    )
    const search = new discord.MessageEmbed()
    .setColor('738ADB')
    .setTitle('<a:Search:845681277922967572> Search Commands')
    .setURL('http://wolfy.tk/')
    .setAuthor(Client.user.username, Client.user.displayAvatarURL())
    .setThumbnail(Client.user.displayAvatarURL())
    .setImage('https://cdn.discordapp.com/attachments/804847293118808074/808859216064413716/Line.gif')
    .addFields(
        { name: `${prefix}covid`, value: `> \`Shows informations about covid in any country\``},
        { name: `${prefix}djs`, value: `> \`Searching for anthing in djs library\``},
        { name: `${prefix}wikipedia`, value: `> \`To search for anything in wikipedia\``},
        { name: `${prefix}steam`, value: `> \`To search for any game information in steam\``},
        { name: `${prefix}mcuser`, value: `> \`To get Mincraft user informations\``},
        { name: `${prefix}weather`, value: `> \`Shows the weather status in any country\``},
    )
    const Utl = new discord.MessageEmbed()
    .setColor('738ADB')
    .setTitle('<a:pp350:836168684379701279> Utilities Commands')
    .setURL('http://wolfy.tk/')
    .setAuthor(Client.user.username, Client.user.displayAvatarURL())
    .setThumbnail(Client.user.displayAvatarURL())
    .setImage('https://cdn.discordapp.com/attachments/804847293118808074/808859216064413716/Line.gif')
    .addFields(
        { name: `${prefix}suggestion`, value: `> \`Send your suggestion for the server\``},
        { name: `${prefix}ping`, value: `> \`Shows the bot ping\``},
        { name: `${prefix}remind`, value: `> \`The bot will reminde you for anything\``},
        { name: `${prefix}report`, value: `> \`To report someone in the server\``},
        { name: `${prefix}calc`, value: `> \`To calculate any thing in math\``},
        { name: `${prefix}yt`, value: `> \`Start new youtube together party\``}
    )
    const moderator = new discord.MessageEmbed()
    .setColor('738ADB')
    .setTitle('<:Rules:840126839938482217> Moderator Commands')
    .setURL('http://wolfy.tk/')
    .setThumbnail(Client.user.displayAvatarURL())
    .setImage('https://cdn.discordapp.com/attachments/804847293118808074/808859216064413716/Line.gif')
    .addFields(
        { name: `${prefix}ban`, value: `> \`Bans a member from the server\``},
        { name: `${prefix}unban`, value: `> \`unBans a member from the server\``},
        { name: `${prefix}kick`, value: `> \`Kick a member from the server\``},
        { name: `${prefix}dm`, value: `> \`Dms someone in the server with message\``},
        { name: `${prefix}say`, value: `> \`The bot will repeat what you say\``},
        { name: `${prefix}embed`, value: `> \`The bot will repeat what you say with embed\``},
        { name: `${prefix}nick`, value: `> \`Changes the nickname of a member\``},
        { name: `${prefix}slowmo`, value: `> \`Adding slowmotion chat to a channel\``},
        { name: `${prefix}nuke`, value: `> \`Nuke any channel (this will delete all the channel and create newone!)\``},
        { name: `${prefix}mute/unmute`, value: `> \`Mute/Unmute someone from texting!\``},
        { name: `${prefix}lock`, value: `> \`Lock the permissions for @everyone from talking in the channel\``},
        { name: `${prefix}unlock`, value: `> \`Unlock the permissions for @everyone from talking in the channel\``}
    )
    const ticket = new discord.MessageEmbed()
    .setColor('738ADB')
    .setTitle('🎫 **Ticket help list**\n\`Note: you must add category with name TICKETS\`')
    .setURL('http://wolfy.tk/')
    .setThumbnail(Client.user.displayAvatarURL())
    .setImage('https://cdn.discordapp.com/attachments/804847293118808074/808859216064413716/Line.gif')
    .addFields(
        { name: `${prefix}ticket`, value: `> \`Open new ticket in the server\``},
        { name: `${prefix}rename`, value: `> \`Change ticket name\``},
        { name: `${prefix}delete`, value: `> \`Delete your ticket in the server\``}
    )
    .setFooter(Client.user.username, Client.user.displayAvatarURL())
    .setTimestamp()
    const Fun = new discord.MessageEmbed()
    .setColor('738ADB')
    .setTitle('<a:pp320:836169046508306432> **Fun Commands**')
    .setURL('http://wolfy.tk/')
    .setThumbnail(Client.user.displayAvatarURL())
    .setImage('https://cdn.discordapp.com/attachments/804847293118808074/808859216064413716/Line.gif')
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

        const pages = [
            help,
            info,
            search,
            Utl,
            moderator,
            ticket,
            Fun
        ]
    
        const emoji = ["⏪", "⏩"]
    
        const timeout = '60000'
    
        pagination(message, pages, emoji, timeout)
}

    

module.exports.help = {
    name: "help",
    aliases: ['Help']
}