const { SlashCommandBuilder } = require('@discordjs/builders');
const discord = require('discord.js');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { QueryType } = require("discord-player")

module.exports = {
    clientpermissions: ['EMBED_LINKS', 'READ_MESSAGE_HISTORY', 'CONNECT', 'SPEAK'],
    guildOnly: true,
	data: new SlashCommandBuilder()
    .setName("seek")
    .setDescription("Seek to the given time")
    .addIntegerOption((option) => 
    option.setName("time").setDescription("The song to skip to").setRequired(true)),
	async execute(client, interaction) {
        const Tracktime = interaction.options.getInteger("time")
        const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("<:error:888264104081522698> There are no songs in the queue!")

        const time = Tracktime * 1000;
        await queue.seek(time);
        await interaction.editReply(`:left_right_arrow: Seeked to ${time / 1000} seconds!`)
	},
};