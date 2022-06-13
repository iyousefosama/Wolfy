const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    clientpermissions: ['EMBED_LINKS', 'READ_MESSAGE_HISTORY'],
	data: new SlashCommandBuilder()
		.setName('invite')
		.setDescription('Replies with bot links/invite!'),
	async execute(client, interaction) {
        const embed = new Discord.MessageEmbed()
        .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
        .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
        .setTimestamp()
        .setThumbnail(client.user.displayAvatarURL())
        .setImage(`https://cdn.discordapp.com/attachments/830926767728492565/874773027177512960/c7d26cb2902f21277d32ad03e7a21139.gif`)
        .setTitle(`${client.user.username} Links`)
        .setDescription(`<a:Cookie:853495749370839050> **Hey, ${interaction.user.username}** that's all my special links!\n\n\`\`\`You can support our bot with voting it on top.gg\`\`\``)
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
        interaction.editReply({ embeds: [embed], components: [row] })
	},
};