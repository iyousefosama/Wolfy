const discord = require('discord.js');
const { MessageEmbed } = require("discord.js")
const ultrax = require('ultrax')

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
	// creating embed1
	const embed1 = new MessageEmbed() 			 
	.setTitle('Hello sir, how can i help you?')
    .setURL('https://discord.js.org/')
    .setDescription(`Hey, ${message.author.username} press the buttons blow to get help!`)
    .addFields(
		{ name: 'Bot verison', value: '0.5' },
		{ name: '\u200B', value: '\u200B' },
		{ name: 'Admin', value: 'admin and moderation helplist', inline: true },
		{ name: 'Fun', value: 'Fun and games helplist', inline: true },
        { name: 'Information', value: 'Information helplist', inline: true },
        { name: 'Search', value: 'Search helplist', inline: true },
        { name: 'Util', value: 'Utilities helplist', inline: true },
	)
    .setThumbnail(Client.user.displayAvatarURL())
	
	// creating embed2
	const embed2 = new MessageEmbed() 	
    .setColor('738ADB')
    .setTitle('Moderator Commands')
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
        { name: `${prefix}mute/unmute`, value: `> \`Mutes/unmute a member from texting\``},
        { name: `${prefix}lock`, value: `> \`Lock the permissions for @everyone from talking in the channel\``},
        { name: `${prefix}unlock`, value: `> \`Unlock the permissions for @everyone from talking in the channel\``}
    )
    .setFooter(Client.user.username, Client.user.displayAvatarURL())
    .setTimestamp()
	
	// creating embed3
	const embed3 = new MessageEmbed() 
    .setColor('738ADB')
    .setTitle('**Fun Commands**')
    .setThumbnail(Client.user.displayAvatarURL())
    .setImage('https://cdn.discordapp.com/attachments/804847293118808074/808859216064413716/Line.gif')
    .addFields(
        { name: `${prefix}8ball`, value: `> \`Ask the 8ball anything and it will answer\``},
        { name: `${prefix}clyed`, value: `> \`Send your message as clyed text message\``},
        { name: `${prefix}cookie`, value: `> \`Give a cookie for a user\``},
        { name: `${prefix}fastTyper`, value: `> \`Start playing fastTyper game\``},
        { name: `${prefix}meme`, value: `> \`Gives random memes\``},
        { name: `${prefix}rpc`, value: `> \`Playing rock/paper/scissors vs the bot\``},
        { name: `${prefix}tweet`, value: `> \`Send your message as tweet message\``},
        { name: `${prefix}waterdrop`, value: `> \`Start playing waterdrop game\``}
    )
    .setFooter(Client.user.username, Client.user.displayAvatarURL())
    .setTimestamp()
	
	// creating embed4
	const embed4 = new MessageEmbed() 
    .setColor('738ADB')
    .setTitle(`Informations Commands`)
    .setAuthor(Client.user.username, Client.user.displayAvatarURL())
    .setThumbnail(Client.user.displayAvatarURL())
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

    const embed5 = new MessageEmbed() 
    .setColor('738ADB')
    .setTitle('Search Commands')
    .setAuthor(Client.user.username, Client.user.displayAvatarURL())
    .setThumbnail(Client.user.displayAvatarURL())
    .addFields(
        { name: `${prefix}covid`, value: `> \`Shows informations about covid in any country\``},
        { name: `${prefix}djs`, value: `> \`Searching for anthing in djs library\``},
        { name: `${prefix}wikipedia`, value: `> \`To search for anything in wikipedia\``},
        { name: `${prefix}steam`, value: `> \`To search for any game information in steam\``},
        { name: `${prefix}mcuser`, value: `> \`To get Mincraft user informations\``},
        { name: `${prefix}weather`, value: `> \`Shows the weather status in any country\``},
    )

    const embed6 = new MessageEmbed() 
    const Utl = new discord.MessageEmbed()
    .setColor('738ADB')
    .setTitle('Utilities Commands')
    .setAuthor(Client.user.username, Client.user.displayAvatarURL())
    .setThumbnail(Client.user.displayAvatarURL())
    .addFields(
        { name: `${prefix}suggestion`, value: `> \`Send your suggestion for the server\``},
        { name: `${prefix}ping`, value: `> \`Shows the bot ping\``},
        { name: `${prefix}remind`, value: `> \`The bot will reminde you for anything\``},
        { name: `${prefix}report`, value: `> \`To report someone in the server\``},
        { name: `${prefix}calc`, value: `> \`To calculate any thing in math\``},
        { name: `${prefix}yt`, value: `> \`Start new youtube together party\``}
    )
    message.channel.send(Utl);
	
	// creating the buttons pages
	await ultrax.ButtonPaginator(message, [embed1, embed2, embed3, embed4, embed5, embed6], [{
	 style: 'green', 
	 label: 'back', 
	 id: 'back' // don't change this line 
	 },

	 { 
	  style: 'blurple',
	  label: 'next', 	
	  id: 'next'  // don't change this line 
	 },
    
     {
        style: 'red',
        label: 'Cancel', 	
        id: 'cancel'  // don't change this line 
     }
	  
	]);
}

    

module.exports.help = {
    name: "nhelp",
    aliases: ['NHelp']
}