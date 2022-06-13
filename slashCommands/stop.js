const { SlashCommandBuilder } = require('@discordjs/builders');
const discord = require('discord.js');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { QueryType } = require("discord-player")

module.exports = {
    clientpermissions: ['EMBED_LINKS', 'READ_MESSAGE_HISTORY', 'CONNECT', 'SPEAK'],
    guildOnly: true,
	data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stops the current song and clears the queue"),
	async execute(client, interaction) {
        const queue = client.player.getQueue(interaction.guildId)

        if (!queue) return await interaction.editReply("<:error:888264104081522698> There are no songs in the queue!")
        queue.destroy()
        await interaction.editReply("<:success:888264105851490355> **Successfully** cleared the queue!")
	},
};