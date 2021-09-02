const discord = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');
const ms = require('parse-ms');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('uptime')
		.setDescription('Replies with bot uptime!'),
	async execute(client, interaction) {
		await interaction.deferReply({ ephemeral: true }).catch(() => {});
		if(!interaction.guild.me.permissions.has('SEND_MESSAGES', 'EMBED_LINKS', 'READ_MESSAGE_HISTORY')) return interaction.editReply({ content: '<a:pp802:768864899543466006> The bot is missing \`SEND_MESSAGES,EMBED_LINKS,READ_MESSAGE_HISTORY\` permission(s)!'})
        let time = ms(client.uptime);
        var uptime = new discord.MessageEmbed()
        .setColor(`DARK_GREEN`)
        .setDescription(`<a:pp399:768864799625838604> **I have been online for \`${time.days}\` days, \`${time.hours}\` hours, \`${time.minutes}\` minutes, \`${time.seconds}\` seconds**`)
        var msg = interaction.editReply({ embeds: [uptime]})
	},
};