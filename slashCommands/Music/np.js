const { SlashCommandBuilder } = require('@discordjs/builders');
const discord = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');
const { QueryType } = require("discord-player")

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "np",
    description: "Displays information about the currently playing track!",
    dmOnly: false,
    guildOnly: true,
    cooldown: 0,
    group: "Music",
    clientPermissions: [
        "EmbedLinks",
        "ReadMessageHistory",
        "Connect",
        "Speak"
    ],
    permissions: [],
    options: []
},
	async execute(client, interaction) {
        const queue = client.player.getQueue(interaction.guildId)

        if (!interaction.member.voice.channel){
            return await interaction.reply("<:error:888264104081522698> Sorry, you need to join a voice channel first to play a track!");
          } else if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId){
            return await interaction.reply("<:error:888264104081522698> You are not in my voice channel!");
          } else if (!queue){
            return await interaction.reply("<:error:888264104081522698> There are no tracks in the queue!");
          };

          if(!queue.playing) {
            return await interaction.reply("<:error:888264104081522698> There is no played track in this server!");
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

		return await interaction.reply({
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