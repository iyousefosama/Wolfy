const discord = require('discord.js')
const { prefix } = require('../../config.json');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: "help",
    aliases: ["Help", "HELP"],
    dmOnly: false, //or false
    guildOnly: false, //or false
    args: false, //or false
    usage: '',
    group: 'bot',
    description: 'Display main bot helplist embed.',
    cooldown: 10, //seconds(s)
    guarded: false, //or false
    permissions: [],
    clientpermissions: ["USE_EXTERNAL_EMOJIS", "EMBED_LINKS", "ATTACH_FILES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"],
    examples: [''],
    async execute(client, message, args) {
    let EmbedName = args.slice(0).join(" ")
    const button = new MessageButton()
    .setLabel(`Info`)
    .setCustomId("1")
    .setStyle('PRIMARY')
    .setEmoji("776670895371714570");
    const button2 = new MessageButton()
    .setLabel(`Search`)
    .setCustomId("2")
    .setStyle('PRIMARY')
    .setEmoji("845681277922967572");
    const button3 = new MessageButton()
    .setLabel(`Utilities`)
    .setCustomId("3")
    .setStyle('PRIMARY')
    .setEmoji("836168684379701279");
    const button4 = new MessageButton()
    .setLabel(`Moderator`)
    .setCustomId("4")
    .setStyle("DANGER")
    .setEmoji("853496185443319809");
    const button5 = new MessageButton()
    .setLabel(`Fun`)
    .setCustomId("5")
    .setStyle("SUCCESS")
    .setEmoji("768867196302524426");
    const button6 = new MessageButton()
    .setLabel(`Setup`)
    .setCustomId("6")
    .setStyle("PRIMARY")
    .setEmoji("836168687891382312");
    const button7 = new MessageButton()
    .setLabel(`Bot`)
    .setCustomId("7")
    .setStyle("PRIMARY")
    .setEmoji("887500717106024520");
    const button8 = new MessageButton()
    .setLabel(`Levels`)
    .setCustomId("8")
    .setStyle("PRIMARY")
    .setEmoji("853495519455215627");
    const button9 = new MessageButton()
    .setLabel(`Economy`)
    .setCustomId("9")
    .setStyle("PRIMARY")
    .setEmoji("877975108038324224");
    const button10 = new MessageButton()
    .setStyle('LINK')
    .setEmoji('853495912775942154')
    .setURL(`https://discord.com/api/oauth2/authorize?client_id=821655420410003497&permissions=8&scope=bot%20applications.commands`) 
    .setLabel('Add me'); 

    const row = new MessageActionRow()
  .addComponents(button, button2, button3, button4, button5);
  const row2 = new MessageActionRow()
  .addComponents(button6, button7, button8, button9, button10);

    const help = new discord.MessageEmbed()
    .setColor('738ADB')
    .setTitle(`Hi ${message.author.username}, how can i help you?`)
	.setURL('https://Wolfy.yoyojoe.repl.co')
    .setAuthor(client.user.username, client.user.displayAvatarURL())
    .setThumbnail(client.user.displayAvatarURL())
    .setDescription(`<a:Right:877975111846731847> Type \`${prefix}feedback\` to report a bug`)
    .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true, size: 2048}))
    .setTimestamp()
    .addFields(
        { name: '<a:BackPag:776670895371714570> informations helplist', value: `\`\`\`${prefix}help info\`\`\``, inline: true},
        { name: '<a:Search:845681277922967572> Search helplist', value: `\`\`\`${prefix}help search\`\`\``, inline: true},
        { name: '<a:pp350:836168684379701279> Utilities helplist', value: `\`\`\`${prefix}help Util\`\`\``, inline: true},
        { name: '<a:pp989:853496185443319809> Moderator helplist', value: `\`\`\`${prefix}help mod\`\`\``, inline: true},
        { name: '<a:pp434:836168673755660290> Fun helplist', value: `\`\`\`${prefix}help bot\`\`\``, inline: true},
        { name: '<:MOD:836168687891382312> Setup Commands', value: `\`\`\`${prefix}help setup\`\`\``, inline: true},
        { name: '<a:pp90:853496126153031710> Bot helplist', value: `\`\`\`${prefix}help bot\`\`\``, inline: true},
        { name: '<a:Up:853495519455215627> Levels helplist', value: `\`\`\`${prefix}help level\`\`\``, inline: true},
        { name: '<a:ShinyMoney:877975108038324224> Economy helplist', value: `\`\`\`${prefix}help eco\`\`\``, inline: true}
    )
    const info = new discord.MessageEmbed()
    .setColor('738ADB')
    .setTitle(`<a:BackPag:776670895371714570> Informations Commands`)
    .setURL('https://Wolfy.yoyojoe.repl.co')
    .setAuthor(client.user.username, client.user.displayAvatarURL())
    .setThumbnail(client.user.displayAvatarURL())
    .addFields(
        { name: `${prefix}server`, value: `> \`Shows informations about a server\``},
        { name: `${prefix}user`, value: `> \`Shows informations about a user\``},
        { name: `${prefix}mcuser`, value: `> \`To get Mincraft user informations\``},
        { name: `${prefix}avatar`, value: `> \`Get a user's avatar.\``},
        { name: `${prefix}savatar`, value: `> \`Get a server's avatar.\``}
    )
    .setFooter(client.user.username, client.user.displayAvatarURL())
    .setTimestamp()
    const search = new discord.MessageEmbed()
    .setColor('738ADB')
    .setTitle('<a:Search:845681277922967572> Search Commands')
    .setURL('https://Wolfy.yoyojoe.repl.co')
    .setAuthor(client.user.username, client.user.displayAvatarURL())
    .setThumbnail(client.user.displayAvatarURL())
    .addFields(
        { name: `${prefix}covid`, value: `> \`Shows informations about covid in any country\``},
        { name: `${prefix}djs`, value: `> \`Searching for anthing in djs library\``},
        { name: `${prefix}wikipedia`, value: `> \`To search for anything in wikipedia\``},
        { name: `${prefix}steam`, value: `> \`To search for any game information in steam\``},
        { name: `${prefix}weather`, value: `> \`Shows the weather status in any country\``},
        { name: `${prefix}lyrics`, value: `> \`The bot will show you the lyrics for the music you are searching for!\``}
    )
    .setFooter(client.user.username, client.user.displayAvatarURL())
    .setTimestamp()
    const Utl = new discord.MessageEmbed()
    .setColor('738ADB')
    .setTitle('<a:pp350:836168684379701279> Utilities Commands')
    .setURL('https://Wolfy.yoyojoe.repl.co')
    .setAuthor(client.user.username, client.user.displayAvatarURL())
    .setThumbnail(client.user.displayAvatarURL())
    .addFields(
        { name: `${prefix}suggestion`, value: `> \`Send your suggestion for the server\``},
        { name: `${prefix}remind`, value: `> \`The bot will reminde you for anything\``},
        { name: `${prefix}report`, value: `> \`To report someone in the server\``},
        { name: `${prefix}live`, value: `> \`Start new youtube together party\``},
        { name: `${prefix}bin`, value: `> \`To upload a code to sourcebin\``},
        { name: `${prefix}ticket`, value: `> \`Open new ticket in the server\``},
        { name: `${prefix}rename`, value: `> \`Change ticket name\``},
        { name: `${prefix}delete`, value: `> \`Delete your ticket in the server\``},
        { name: `${prefix}ticketpanel`, value: `> \`Setup the ticket panel in the server\``}
    )
    .setFooter(client.user.username, client.user.displayAvatarURL())
    .setTimestamp()
    const moderator = new discord.MessageEmbed()
    .setColor('738ADB')
    .setTitle('<a:pp989:853496185443319809> Moderator Commands')
    .setURL('https://Wolfy.yoyojoe.repl.co')
    .setThumbnail(client.user.displayAvatarURL())
    .addFields(
        { name: `${prefix}ban`, value: `> \`Bans a member from the server\``},
        { name: `${prefix}hackban`, value: `> \`Bans a member not in the server\``},
        { name: `${prefix}softban`, value: `> \`Kicks a user and deletes all their messages in the past 7 days\``},
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
        { name: `${prefix}lockdown`, value: `> \`It lock all channels for @everyone from talking\``},
        { name: `${prefix}clear`, value: `> \`Clear/Delete message with quantity you want (from 2 to 100)\``}
    )
    .setFooter(client.user.username, client.user.displayAvatarURL())
    .setTimestamp()
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
        { name: `${prefix}waterdrop`, value: `> \`Start playing waterdrop game\``}
    )
    .setFooter(client.user.username, client.user.displayAvatarURL())
    .setTimestamp()
    const setup = new discord.MessageEmbed()
    .setColor('738ADB')
    .setTitle('<:MOD:836168687891382312> **Setup Commands**')
    .setURL('https://Wolfy.yoyojoe.repl.co')
    .setAuthor(client.user.username, client.user.displayAvatarURL())
    .setThumbnail(client.user.displayAvatarURL())
    .addFields(
        { name: `${prefix}setLogsch`, value: `> \`Setup the logs channel bot will send logs there!\``},
        { name: `${prefix}setReportch`, value: `> \`Setup the reports channel bot will send reports from users there!\``},
        { name: `${prefix}setSuggch`, value: `> \`Setup the suggestion channel bot will send suggestions from users there!\``},
        { name: `${prefix}setwelcomech`, value: `> \`Setup the welcome channel bot will send message when user join there!\``},
        { name: `${prefix}setleaverch`, value: `> \`Setup the leaver channel bot will send message when user join there!\``},
        { name: `${prefix}setTicketch`, value: `> \`Setup the ticket category bot will create tickets channels from users there!\``},
        { name: `${prefix}setwelcomemsg`, value: `> \`To set the welcome (msg/embed)\``},
        { name: `${prefix}setleavermsg`, value: `> \`To set the leaver (msg/embed)\``},
        { name: `${prefix}badwords`, value: `> \`Add/remove/show blacklisted words for the current guild.\``},
        { name: `${prefix}[cmd]toggle`, value: `> \`To toggle a cmd <off/on> from setup cmds!\``},
        { name: `${prefix}setprefix`, value: `> \`To set the bot prefix to another one!\``},
    )
    .setFooter(client.user.username, client.user.displayAvatarURL())
    .setTimestamp()
    const bot = new discord.MessageEmbed()
    .setColor('738ADB')
    .setTitle('<:Bot:841711382739157043> **Bot Commands**')
    .setURL('https://Wolfy.yoyojoe.repl.co')
    .setThumbnail(client.user.displayAvatarURL())
    .addFields(
        { name: `${prefix}stats`, value: `> \`Show bot stats and informations\``},
        { name: `${prefix}links`, value: `> \`Shows all bot special link vote/invite ..\``},
        { name: `${prefix}feedback`, value: `> \`To give a feedback about bot or to report bug\``},
        { name: `${prefix}help`, value: `> \`Display main bot helplist embed.\``},
        { name: `${prefix}ping`, value: `> \`Shows the bot ping\``},
        { name: `${prefix}uptime`, value: `> \`Show the bot uptime\``}
    )
    .setFooter(client.user.username, client.user.displayAvatarURL())
    .setTimestamp()
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
    const Eco = new discord.MessageEmbed()
    .setColor('738ADB')
    .setTitle('<a:ShinyMoney:877975108038324224> **Economy Commands**')
    .setURL('https://Wolfy.yoyojoe.repl.co')
    .setThumbnail(client.user.displayAvatarURL())
    .addFields(
        { name: `${prefix}profile`, value: `> \`Shows your profile card!\``},
        { name: `${prefix}setbio`, value: `> \`Sets your profile card bio.\``},
        { name: `${prefix}setbirthday`, value: `> \`Sets your profile card birthday.\``},
        { name: `${prefix}credits`, value: `> \`To check your credits balance in wallet\``},
        { name: `${prefix}cookie`, value: `> \`To send cookie for a friend as a gift\``},
        { name: `${prefix}beg`, value: `> \`Want to earn money some more? Why don\'t you try begging, maybe someone will give you.\``},
        { name: `${prefix}daily`, value: `> \`To get your daily reward\``},
        { name: `${prefix}fish`, value: `> \`Take your fishingpole and start fishing\``},
        { name: `${prefix}mine`, value: `> \`What you know about mining down in the deep?\``},
        { name: `${prefix}register`, value: `> \`To register a bank account\``},
        { name: `${prefix}bank`, value: `> \`To check your credits balance in wallet\``},
        { name: `${prefix}deposit`, value: `> \`Deposit credits from your wallet to safeguard\``},
        { name: `${prefix}withdraw`, value: `> \`Withdraw credits from your bank to your wallet\``},
        { name: `${prefix}inv`, value: `> \`Show your inventory items! (currently support mining only)\``},
        { name: `${prefix}sell`, value: `> \`Sell item from your inventory and get some credits!\``},
        { name: `${prefix}market`, value: `> \`Open the economy market!\``},
        { name: `${prefix}buy`, value: `> \`To buy items from the market\``},
        { name: `${prefix}use`, value: `> \`Equips an item from your inventory.\``},
        { name: `${prefix}previewitem`, value: `> \`Check what you can buy from the shop.\``},
    )
    .setFooter(client.user.username, client.user.displayAvatarURL())
    .setTimestamp()
    if(EmbedName) {

    if(EmbedName.toLowerCase() === 'info' || EmbedName.toLowerCase() === 'information') {
    message.channel.send({ embeds: [info]})
    } else if(EmbedName.toLowerCase() === 'search') {
    message.channel.send({ embeds: [search]})
    } else if(EmbedName.toLowerCase() === 'utl' || EmbedName.toLowerCase() === 'util' || EmbedName.toLowerCase() === 'utilities') {
    message.channel.send({ embeds: [Utl]})
    } else if(EmbedName.toLowerCase() === 'moderator' || EmbedName.toLowerCase() === 'mod') {
    message.channel.send({ embeds: [moderator]})
    } else if(EmbedName.toLowerCase() === 'fun') {
    message.channel.send({ embeds: [Fun]})
    } else if(EmbedName.toLowerCase() === 'setup') {
    message.channel.send({ embeds: [setup]})
    } else if(EmbedName.toLowerCase() === 'bot') {
    message.channel.send({ embeds: [bot]})
    } else if(EmbedName.toLowerCase() === 'level') {
    message.channel.send({ embeds: [level]})
    } else if(EmbedName.toLowerCase() === 'eco' || EmbedName.toLowerCase() === 'economy') {
    message.channel.send({ embeds: [Eco]})
    } else {
        return message.channel.send(`\\❌ | ${message.author}, Please type a valid group type or use \`${prefix}help\`!`);
    }
    } else {
    const msg = await message.reply({ embeds: [help], components: [row, row2] })
    const collector = msg.createMessageComponentCollector({ time: 15000, fetch: true });

    collector.on('collect', async interactionCreate => {
        if(interactionCreate.customId === '1'){
            if (!interactionCreate.member.id == message.author.id) return interactionCreate.deferUpdate()
            interactionCreate.reply({ embeds: [info], ephemeral: true})
            }
            if(interactionCreate.customId === '2'){
                if (!interactionCreate.member.id == message.author.id) return interactionCreate.deferUpdate()
                interactionCreate.reply({ embeds: [search], ephemeral: true})
            }
            if(interactionCreate.customId === '3'){
                if (!interactionCreate.member.id == message.author.id) return interactionCreate.deferUpdate()
                interactionCreate.reply({ embeds: [Utl], ephemeral: true})
            }
            if(interactionCreate.customId === '4'){
                if (!interactionCreate.member.id == message.author.id) return interactionCreate.deferUpdate()
                interactionCreate.reply({ embeds: [moderator], ephemeral: true})
            }
            if(interactionCreate.customId === '5'){
                if (!interactionCreate.member.id == message.author.id) return interactionCreate.deferUpdate()
                interactionCreate.reply({ embeds: [Fun], ephemeral: true})
            }
            if(interactionCreate.customId === '6'){
                if (!interactionCreate.member.id == message.author.id) return interactionCreate.deferUpdate()
                interactionCreate.reply({ embeds: [setup], ephemeral: true})
            }
            if(interactionCreate.customId === '7'){
                if (!interactionCreate.member.id == message.author.id) return interactionCreate.deferUpdate()
                interactionCreate.reply({ embeds: [bot], ephemeral: true})
            }
            if(interactionCreate.customId === '8'){
                if (!interactionCreate.member.id == message.author.id) return interactionCreate.deferUpdate()
                interactionCreate.reply({ embeds: [level], ephemeral: true})
            }
            if(interactionCreate.customId === '9'){
                if (!interactionCreate.member.id == message.author.id) return interactionCreate.deferUpdate()
                interactionCreate.reply({ embeds: [Eco], ephemeral: true})
            }
})
    collector.on('end', message => {
        button.setDisabled(true)
        button2.setDisabled(true)
        button3.setDisabled(true)
        button4.setDisabled(true)
        button5.setDisabled(true)
        button6.setDisabled(true)
        button7.setDisabled(true)
        button8.setDisabled(true)
        button9.setDisabled(true)
        const newrow = new MessageActionRow()
        .addComponents(button, button2, button3, button4, button5);
        const newrow2 = new MessageActionRow()
        .addComponents(button6, button7, button8, button9, button10);
        msg.edit({embeds: [help], components: [newrow, newrow2]}).catch(() => null)
    })
}
}
}
