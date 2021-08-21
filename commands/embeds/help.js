const discord = require('discord.js')
const { MessageActionRow, MessageButton } = require('discord-buttons')
const { prefix } = require('../../config.json');

module.exports = {
    name: "help",
    aliases: ["Help", "HELP"],
    dmOnly: false, //or false
    guildOnly: false, //or false
    args: false, //or false
    usage: '',
    cooldown: 10, //seconds(s)
    guarded: false, //or false
    clientpermissions: ["USE_EXTERNAL_EMOJIS", "EMBED_LINKS", "ATTACH_FILES", "VIEW_CHANNEL"],
    async execute(client, message, args) {
    const button = new MessageButton()
    .setLabel(`Info`)
    .setID("1")
    .setStyle("blurple")
    .setEmoji("776670895371714570");
    const button2 = new MessageButton()
    .setLabel(`Search`)
    .setID("2")
    .setStyle("blurple")
    .setEmoji("845681277922967572");
    const button3 = new MessageButton()
    .setLabel(`Utilities`)
    .setID("3")
    .setStyle("blurple")
    .setEmoji("836168684379701279");
    const button4 = new MessageButton()
    .setLabel(`Moderator`)
    .setID("4")
    .setStyle("red")
    .setEmoji("853496185443319809");
    const button5 = new MessageButton()
    .setLabel(`Fun`)
    .setID("5")
    .setStyle("green")
    .setEmoji("768867196302524426");

    const row = new MessageActionRow()
  .addComponents(button, button2, button3, button4, button5);

    const help = new discord.MessageEmbed()
    .setColor('738ADB')
    .setTitle(`Hi ${message.author.username}, how can i help you?`)
	.setURL('https://Wolfy.yoyojoe.repl.co')
    .setAuthor(client.user.username, client.user.displayAvatarURL())
    .setThumbnail(client.user.displayAvatarURL())
    .setDescription(`Type ${prefix}feedback to report a bug`, client.user.displayAvatarURL(({dynamic: true, format: 'png', size: 512})))
    .setTimestamp()
    .addFields(
        { name: '<a:BackPag:776670895371714570> informations helplist', value: `\`\`\`${prefix}helpinfo\`\`\``, inline: true},
        { name: '<a:Search:845681277922967572> Search helplist', value: `\`\`\`${prefix}helpsearch\`\`\``, inline: true},
        { name: '<a:pp350:836168684379701279> Utilities helplist', value: `\`\`\`${prefix}helpUtl\`\`\``, inline: true},
        { name: '<a:pp989:853496185443319809> Moderator helplist', value: `\`\`\`${prefix}helpmod\`\`\``, inline: true},
        { name: '<a:pp434:836168673755660290> Fun helplist', value: `\`\`\`${prefix}helpbot\`\`\``, inline: true},
        { name: '🎫 Ticket helplist', value: `\`\`\`${prefix}helpticket\`\`\``, inline: true},
        { name: '<a:pp90:853496126153031710> Bot helplist', value: `\`\`\`${prefix}helpbot\`\`\``, inline: true},
        { name: '<a:Up:853495519455215627> Levels helplist', value: `\`\`\`${prefix}helplevel\`\`\``, inline: true},
        { name: '<a:Right:860969895779893248> Soon', value: `\`\`\` ‍ \`\`\``, inline: true}
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
        { name: `${prefix}avatar`, value: `> \`Get a user's avatar.\``},
        { name: `${prefix}savatar`, value: `> \`Get a server's avatar.\``},
        { name: `${prefix}invite`, value: `> \`To see your invites count\``}
    )
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
        { name: `${prefix}mcuser`, value: `> \`To get Mincraft user informations\``},
        { name: `${prefix}weather`, value: `> \`Shows the weather status in any country\``},
        { name: `${prefix}lyrics`, value: `> \`The bot will show you the lyrics for the music you are searching for!\``}
    )
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
        { name: `${prefix}calculator`, value: `> \`To send the calculator\``},
        { name: `${prefix}live`, value: `> \`Start new youtube together party\``}
    )
    const moderator = new discord.MessageEmbed()
    .setColor('738ADB')
    .setTitle('<a:pp989:853496185443319809> Moderator Commands')
    .setURL('https://Wolfy.yoyojoe.repl.co')
    .setThumbnail(client.user.displayAvatarURL())
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
        { name: `${prefix}unlock`, value: `> \`Unlock the permissions for @everyone from talking in the channel\``},
        { name: `${prefix}lockdown`, value: `> \`It lock all channels for @everyone from talking\``},
        { name: `${prefix}clear`, value: `> \`Clear/Delete message with quantity you want (from 2 to 100)\``}
    )
    const Fun = new discord.MessageEmbed()
    .setColor('738ADB')
    .setTitle('<a:pp434:836168673755660290> **Fun Commands**')
    .setURL('https://Wolfy.yoyojoe.repl.co')
    .setThumbnail(client.user.displayAvatarURL())
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
    const msg = await message.channel.send({embed : help, components : row})
    const filter = async (button) => {
            if(button.id === '1'){
                if (button.clicker.id !== message.author.id) return button.reply.defer()
                button.reply.send(info, true)
                }
                if(button.id === '2'){
                    if (button.clicker.id !== message.author.id) return button.reply.defer()
                    button.reply.send(search, true)
                }
                if(button.id === '3'){
                    if (button.clicker.id !== message.author.id) return button.reply.defer()
                    button.reply.send(Utl, true)
                }
                if(button.id === '4'){
                    if (button.clicker.id !== message.author.id) return button.reply.defer()
                    button.reply.send(moderator, true)
                }
                if(button.id === '5'){
                    if (button.clicker.id !== message.author.id) return button.reply.defer()
                    button.reply.send(Fun, true)
            }
    }
    const collector = msg.createButtonCollector(filter, { time: 30000 }); 
    collector.on('end', message => {
        button.setDisabled(true)
        button2.setDisabled(true)
        button3.setDisabled(true)
        button4.setDisabled(true)
        button5.setDisabled(true)
        const newrow = new MessageActionRow()
        .addComponents(button, button2, button3, button4, button5);
        msg.edit({embed : help, components : newrow})
    })
}
}
