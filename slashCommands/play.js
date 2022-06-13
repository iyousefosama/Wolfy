const { SlashCommandBuilder } = require('@discordjs/builders');
const discord = require('discord.js');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { QueryType } = require("discord-player")

module.exports = {
    clientpermissions: ['EMBED_LINKS', 'READ_MESSAGE_HISTORY', 'CONNECT', 'SPEAK'],
    guildOnly: true,
	data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays songs from youtube")
    .addSubcommand((subcommand) =>
        subcommand
            .setName("search")
            .setDescription("Searches for song based on provided name")
            .addStringOption((option) =>
                option.setName("name").setDescription("The search keywords(Song name)").setRequired(true)
            )
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName("song")
            .setDescription("Loads a single song from a url")
            .addStringOption((option) => option.setName("url").setDescription("the song's url").setRequired(true))
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName("playlist")
            .setDescription("Loads a playlist of songs from a url")
            .addStringOption((option) => option.setName("url").setDescription("the playlist's url").setRequired(true))
    ),
	async execute(client, interaction) {
        if (!interaction.member.voice.channel) {
            return interaction.editReply("<:error:888264104081522698> Sorry, you need to join a voice channel first to play a song!");
        }

		const queue = await client.player.createQueue(interaction.guild)
		if (!queue.connection) await queue.connect(interaction.member.voice.channel)

		let embed = new MessageEmbed()

		if (interaction.options.getSubcommand() === "song") {
            let url = interaction.options.getString("url")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO
            })
            if (result.tracks.length === 0)
                return interaction.editReply("<:error:888264104081522698> No results found for this url!")
            
            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}`, iconURL: client.user.displayAvatarURL({ dynamic: true })})

		} else if (interaction.options.getSubcommand() === "playlist") {
            let url = interaction.options.getString("url")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST
            })

            if (result.tracks.length === 0)
                return interaction.editReply("<:error:888264104081522698> No results found for this url!")
            
            const playlist = result.playlist
            await queue.addTracks(result.tracks)
            embed
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setDescription(`**${result.tracks.length} songs from [${playlist.title}](${playlist.url})** have been added to the Queue`)
                .setThumbnail(playlist.thumbnail)
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true })})
		} else if (interaction.options.getSubcommand() === "search") {
            let url = interaction.options.getString("name")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })

            if (result.tracks.length === 0)
                return interaction.editReply("<:error:888264104081522698> No results found for this song name!")
            
            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
            .setThumbnail(song.thumbnail)
            .setFooter({ text: `Duration: ${song.duration}`, iconURL: client.user.displayAvatarURL({ dynamic: true })})
		}
        if (!queue.playing) await queue.play()
        await interaction.editReply({
            embeds: [embed]
        })
	},
};