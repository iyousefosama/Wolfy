const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const mcapi = require('mcapi');

module.exports = {
    clientpermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'READ_MESSAGE_HISTORY'],
	data: new SlashCommandBuilder()
		.setName('mcuser')
		.setDescription('Gives informations about minecraft user player!')
        .addStringOption(option => option.setName('query').setDescription('Enter a player name').setRequired(true)),
	async execute(client, interaction) {
		await interaction.deferReply({ ephemeral: false }).catch(() => {});
        const query = interaction.options.getString('query');

        try{
            let uuid = await mcapi.usernameToUUID(`${query}`)
            let embed = new Discord.MessageEmbed()
            .setTitle(`User: ${query}`)
            .addField("Name:", `${query}`)
            .addField("UUID:", uuid)
            .addField("Download:", `[Download](https://minotar.net/download/${query})`)
            .addField("NameMC:", `[Click Here](https://mine.ly/${query}.1)`)
            .setImage(`https://minecraftskinstealer.com/api/v1/skin/render/fullbody/${query}/700`)
            .setColor('#ffd167')
            .setThumbnail(`https://minotar.net/cube/${query}/100.png)`)
            interaction.editReply({ embeds: [embed] });
        } catch(e) {
            let embed2 = new Discord.MessageEmbed()
            .setDescription('<a:pp681:774089750373597185> **|** The specified user was not found!')
            interaction.editReply({ embeds: [embed2] })
        }
	},
};