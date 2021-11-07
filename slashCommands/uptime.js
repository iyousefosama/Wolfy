const discord = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');
const ms = require('parse-ms');

module.exports = {
	clientpermissions: ['EMBED_LINKS',  'USE_EXTERNAL_EMOJIS'],
	data: new SlashCommandBuilder()
		.setName('uptime')
		.setDescription('Replies with bot uptime!')
		.addBooleanOption(option => option.setName('hide').setDescription('Hide the output')),
	async execute(client, interaction) {
		const hide = interaction.options.getBoolean('hide');
		if(hide === true) {
			await interaction.deferReply({ ephemeral: true }).catch(() => {});
		} else {
			await interaction.deferReply({ ephemeral: false }).catch(() => {});
		}

        let time = ms(client.uptime);
        var uptime = new discord.MessageEmbed()
        .setColor(`DARK_GREEN`)
        .setDescription(`<a:pp399:768864799625838604> **I have been online for \`${time.days}\` days, \`${time.hours}\` hours, \`${time.minutes}\` minutes, \`${time.seconds}\` seconds**`)
        var msg = interaction.editReply({ embeds: [uptime]})
	},
};