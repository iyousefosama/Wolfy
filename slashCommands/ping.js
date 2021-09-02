const discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with bot ping!'),
	async execute(client, interaction) {
		await interaction.deferReply({ ephemeral: false }).catch(() => {});
		if(!interaction.guild.me.permissions.has('SEND_MESSAGES', 'EMBED_LINKS', 'READ_MESSAGE_HISTORY')) return interaction.editReply({ content: '<a:pp802:768864899543466006> The bot is missing \`SEND_MESSAGES,EMBED_LINKS,READ_MESSAGE_HISTORY\` permission(s)!'})
        var loading = new discord.MessageEmbed()
        .setColor('GOLD')
        .setDescription(`<a:Loading_Color:759734580122484757> Finding bot ping...`)
        var msg = interaction.editReply({ embeds: [loading]}).then(msg => { // sends this once you send the cmd
        const ping = msg.createdTimestamp - interaction.createdTimestamp; // calculation the time between when u send the message and when the bot reply
        let Pong = new discord.MessageEmbed()
        .setColor('YELLOW')
        .setDescription(`Pong!`)
        interaction.editReply({ embeds: [Pong]})
        let Ping = new discord.MessageEmbed()
        .setColor('DARK_GREEN')
        .setDescription(`The Ping of the bot is \`${ping}ms\`!`)
        interaction.editReply({ embeds: [Ping] })
        })
	},
};