const discord = require('discord.js')
const { ActionRowBuilder, ButtonBuilder } = require('discord.js');

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
    clientPermissions: [discord.PermissionsBitField.Flags.EmbedLinks, discord.PermissionsBitField.Flags.UseExternalEmojis, discord.PermissionsBitField.Flags.AttachFiles],
    examples: [''],
    async execute(client, message, args) {
        const embed = new discord.EmbedBuilder()
        .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
        .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL() })
        .setTimestamp()
        .setThumbnail(client.user.displayAvatarURL())
        .setImage(`https://cdn.discordapp.com/attachments/830926767728492565/874773027177512960/c7d26cb2902f21277d32ad03e7a21139.gif`)
        .setTitle(`${client.user.username} Links`)
        .setDescription(`<a:Cookie:853495749370839050> **Hey, ${message.author.username}** that's all my special links!\n\n\`\`\`You can support our bot with voting it on top.gg\`\`\``)
        .setURL(client.config.websites["website"])
        let button = new ButtonBuilder()
        .setStyle(`Link`)
        .setEmoji('853495153280155668')
        .setURL(client.config.websites["support"]) 
        .setLabel('Support server'); 
        let button2 = new ButtonBuilder()
        .setStyle(`Link`)
        .setEmoji('841711382739157043')
        .setURL(client.config.websites["invite"]) 
        .setLabel('Add bot!'); 
        let button3 = new ButtonBuilder()
        .setStyle(`Link`)
        .setEmoji('853496052899381258')
        .setURL(client.config.websites["top.gg"]) 
        .setLabel('Vote here!'); 
        let button4 = new ButtonBuilder()
        .setStyle(`Link`)
        .setEmoji('853495912775942154')
        .setURL(client.config.websites["website"]) 
        .setLabel('Bot Website!');
        const row = new ActionRowBuilder()
        .addComponents(button, button2, button3, button4);
        message.channel.sendTyping()
        message.channel.send({ embeds: [embed], components: [row] })
    }
}