const { SlashCommandBuilder } = require('@discordjs/builders');
const discord = require('discord.js');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { QueryType } = require("discord-player")

module.exports = {
    clientpermissions: ['EMBED_LINKS', 'READ_MESSAGE_HISTORY'],
	data: new SlashCommandBuilder()
    .setName("shuffle")
    .setDescription("Plays a random song from the queue"),
	async execute(client, interaction) {
        const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("<:error:888264104081522698> There are no songs in the queue!")

        queue.shuffle()
        await interaction.editReply(`<a:Bagopen:877975110806540379> The queue of \`${queue.tracks.length}\` songs have been shuffled!`)
	},
};