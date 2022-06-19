const { SlashCommandBuilder } = require('@discordjs/builders');
const discord = require('discord.js');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { QueryType } = require("discord-player")

module.exports = {
    clientpermissions: ['EMBED_LINKS', 'READ_MESSAGE_HISTORY', 'CONNECT', 'SPEAK'],
	guildOnly: true,
	data: new SlashCommandBuilder()
    .setName("np")
    .setDescription("Displays informations about the currently playing track!"),
	async execute(client, interaction) {
        const queue = client.player.getQueue(interaction.guildId)

        if (!interaction.member.voice.channel){
            return await interaction.editReply("<:error:888264104081522698> Sorry, you need to join a voice channel first to play a song!");
          } else if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId){
            return await interaction.editReply("<:error:888264104081522698> You are not in my voice channel!");
          } else if (!client.player.getQueue(interaction.guild.id)){
            return await interaction.editReply("<:error:888264104081522698> There are no songs in the queue!");
          };

		let bar = queue.createProgressBar({
			timecodes: true,
			queue: false,
			length: 19,
		})

        const song = queue.current
		const currentQueue = client.player.getQueue(interaction.guildId);
    
        const volume = currentQueue.volume;
        const repeatMode = currentQueue.repeatMode;

		console.log(paused)
		await interaction.editReply({
			embeds: [new MessageEmbed()
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setFooter({ text: `Duration: ${song.duration}`, iconURL: client.user.displayAvatarURL({ dynamic: true })})
            .setThumbnail(song.thumbnail)
            .setDescription(`Currently Playing [${song.title}](${song.url})\n\n` + bar)
			.addFields(
				{ name: 'Requested by', value: song.requestedBy.username || 'None', inline: true },
				{ name: 'Volume', value: volume + '%' || 'None', inline: true },
			)
        ],
		})
	},
};