const { SlashCommandBuilder } = require('@discordjs/builders');
const discord = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');
const { QueryType } = require("discord-player")

module.exports = {
  clientpermissions: [discord.PermissionsBitField.Flags.EmbedLinks, discord.PermissionsBitField.Flags.ReadMessageHistory, discord.PermissionsBitField.Flags.Connect, discord.PermissionsBitField.Flags.Speak],
	guildOnly: true,
	data: new SlashCommandBuilder()
    .setName("np")
    .setDescription("Displays informations about the currently playing track!"),
	async execute(client, interaction) {
        const queue = client.player.getQueue(interaction.guildId)

        if (!interaction.member.voice.channel){
            return await interaction.editReply("<:error:888264104081522698> Sorry, you need to join a voice channel first to play a track!");
          } else if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId){
            return await interaction.editReply("<:error:888264104081522698> You are not in my voice channel!");
          } else if (!queue){
            return await interaction.editReply("<:error:888264104081522698> There are no tracks in the queue!");
          };

          if(!queue.playing) {
            return await interaction.editReply("<:error:888264104081522698> There is no played track in this server!");
          }


		let bar = await queue.createProgressBar({
			timecodes: true,
			queue: false,
			length: 19,
		})

        const track = queue.current
        const currentQueue = client.player.getQueue(interaction.guildId);
        const volume = currentQueue.volume;
        const repeatMode = currentQueue.repeatMode;

		return await interaction.editReply({
			embeds: [new EmbedBuilder()
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setFooter({ text: `Duration: ${track.duration}`, iconURL: client.user.displayAvatarURL({ dynamic: true })})
            .setThumbnail(track.thumbnail)
            .setDescription(`Currently Playing [${track.title}](${track.url})\n\n` + bar)
			.addFields(
				{ name: 'Requested by', value: track.requestedBy.username || 'None', inline: true },
				{ name: 'Volume', value: volume + '%' || 'None', inline: true },
			)
        ],
		})
	},
};