const discord = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');
const ms = require('parse-ms');

module.exports = {
	clientpermissions: [discord.PermissionsBitField.Flags.EmbedLinks,  discord.PermissionsBitField.Flags.UseExternalEmojis],
	data: new SlashCommandBuilder()
		.setName('uptime')
		.setDescription('Replies with bot uptime!')
		.addBooleanOption(option => option.setName('hide').setDescription('Hide the output')),
	async execute(client, interaction) {
		const hide = interaction.options.getBoolean('hide');

        let time = ms(client.uptime);
        var uptime = new discord.EmbedBuilder()
        .setColor(`DarkGreen`)
        .setDescription(`<a:pp399:768864799625838604> **I have been online for \`${time.days}\` days, \`${time.hours}\` hours, \`${time.minutes}\` minutes, \`${time.seconds}\` seconds**`)
        var msg = interaction.editReply({ embeds: [uptime], ephemeral: true})
	},
};