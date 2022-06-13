const { SlashCommandBuilder } = require('@discordjs/builders');
const discord = require('discord.js');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { QueryType } = require("discord-player")

module.exports = {
    clientpermissions: ['EMBED_LINKS', 'READ_MESSAGE_HISTORY', 'CONNECT', 'SPEAK'],
    guildOnly: true,
	data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips the current song"),
	async execute(client, interaction) {
        const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("<:error:888264104081522698> There are no songs in the queue!")

        const currentSong = queue.current

		queue.skip()
        await interaction.editReply({
            embeds: [
                new MessageEmbed().setDescription(`${currentSong.title} has been skipped!`).setThumbnail(currentSong.thumbnail).setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) }).setFooter({ text: `Duration: ${currentSong.duration}`, iconURL: client.user.displayAvatarURL({ dynamic: true })})
            ]
        })
	},
};