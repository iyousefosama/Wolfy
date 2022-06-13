const { SlashCommandBuilder } = require('@discordjs/builders');
const discord = require('discord.js');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { QueryType } = require("discord-player")

module.exports = {
    clientpermissions: ['EMBED_LINKS', 'READ_MESSAGE_HISTORY', 'CONNECT', 'SPEAK'],
    guildOnly: true,
	data: new SlashCommandBuilder()
    .setName("skipto")
    .setDescription("Skips the current song to a certain track")
    .addNumberOption((option) => 
    option.setName("tracknumber").setDescription("The song to skip to").setRequired(true)),
	async execute(client, interaction) {
        const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("<:error:888264104081522698> There are no songs in the queue!")

        const trackNum = interaction.options.getNumber("tracknumber")
        if (trackNum > queue.tracks.length) return await interaction.editReply("<:error:888264104081522698> Invalid track number!")
        if (trackNum < 1) return await interaction.editReply("<:error:888264104081522698> Invalid track number!")
		queue.skipTo(trackNum - 1)

        await interaction.editReply(`<:success:888264105851490355> **Successfully** skipped to the track number \`${trackNum}\`!`)
	},
};