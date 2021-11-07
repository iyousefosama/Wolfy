const discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
const { MessageEmbed } = require('discord.js');

module.exports = {
    clientpermissions: ['EMBED_LINKS', 'ATTACH_FILES'],
	data: new SlashCommandBuilder()
		.setName('clyed')
		.setDescription('Send your message as clyed text message!')
        .addStringOption(option => option.setName('input').setDescription('Enter a input').setRequired(true)),
	async execute(client, interaction) {
		await interaction.deferReply({ ephemeral: false }).catch(() => {});

        const input = interaction.options.getString('input');

        if(input.length > 100) return interaction.editReply({ content: '<a:Wrong:812104211361693696> Sorry you can\`t type more than \`100 letters!\`' })
        axios
        .get(`https://nekobot.xyz/api/imagegen?type=clyde&text=${input}`)
        .then((res) => {
            const embed = new MessageEmbed()
            .setImage(res.data.message)
            interaction.editReply({ embeds: [embed] })
        })
        .catch(err => {
            interaction.editReply({ content: '<a:Error:836169051310260265> **|** Incorrect input, please try again!'});
          })
	},
};