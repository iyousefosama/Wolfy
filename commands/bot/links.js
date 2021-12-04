const Discord = require('discord.js')
const { url } = require('sourcebin');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: "links",
    aliases: ["link", "inviteme", "invitebot", "vote", "support", "LINKS", "invite"],
    dmOnly: false, //or false
    guildOnly: false, //or false
    args: false, //or false
    usage: '',
    group: 'bot',
    description: 'Shows all bot special link vote/invite ..',
    cooldown: 10, //seconds(s)
    guarded: false, //or false
    permissions: [],
    clientpermissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS", "ATTACH_FILES"],
    examples: [''],
    async execute(client, message, args) {
        const embed = new Discord.MessageEmbed()
        .setAuthor(client.user.username, client.user.displayAvatarURL())
        .setFooter(message.author.username, message.author.displayAvatarURL())
        .setTimestamp()
        .setThumbnail(client.user.displayAvatarURL())
        .setImage(`https://cdn.discordapp.com/attachments/830926767728492565/874773027177512960/c7d26cb2902f21277d32ad03e7a21139.gif`)
        .setTitle(`${client.user.username} Links`)
        .setDescription(`<a:Cookie:853495749370839050> **Hey, ${message.author.username}** that's all my special links!\n\n\`\`\`You can support our bot with voting it on top.gg\`\`\``)
        .setURL(`https://wolfy.yoyojoe.repl.co/`)
        let button = new MessageButton()
        .setStyle('LINK')
        .setEmoji('853495153280155668')
        .setURL(`https://discord.gg/qYjus2rujb`) 
        .setLabel('Support server'); 
        let button2 = new MessageButton()
        .setStyle('LINK')
        .setEmoji('841711382739157043')
        .setURL(`https://discord.com/api/oauth2/authorize?client_id=821655420410003497&permissions=8&scope=bot%20applications.commands`) 
        .setLabel('Add bot!'); 
        let button3 = new MessageButton()
        .setStyle('LINK')
        .setEmoji('853496052899381258')
        .setURL(`https://top.gg/bot/821655420410003497`) 
        .setLabel('Vote here!'); 
        let button4 = new MessageButton()
        .setStyle('LINK')
        .setEmoji('853495912775942154')
        .setURL(`https://wolfy.yoyojoe.repl.co/`) 
        .setLabel('Bot Website!');
        const row = new MessageActionRow()
        .addComponents(button, button2, button3, button4);
        message.channel.sendTyping()
        message.channel.send({ embeds: [embed], components: [row] })
    }
}