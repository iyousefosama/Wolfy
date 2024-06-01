const discord = require('discord.js');
const { MessageActionRow, MessageButton, EmbedBuilder } = require('discord.js');
const { QueryType } = require("discord-player")
const playdl = require("play-dl");

module.exports = {
  name: "NowPlaying",
  aliases: ["np", "Np", "NP"],
  dmOnly: false, //or false
  guildOnly: true, //or false
  args: false, //or false
  usage: '',
  group: 'Music',
  description: 'Displays informations about the currently playing track!',
  cooldown: 3, //seconds(s)
  guarded: false, //or false
  permissions: [],
  clientPermissions: [discord.PermissionsBitField.Flags.Connect, discord.PermissionsBitField.Flags.Speak],
  examples: [
      ''
    ],
  async execute(client, message, args) {
        const queue = client.player.getQueue(message.guildId)

        if (!message.member.voice.channel){
            return await message.reply("<:error:888264104081522698>  Sorry, you need to join a voice channel first to play a song!");
          } else if (message.guild.members.me.voice.channelId && message.member.voice.channelId !== message.guild.members.me.voice.channelId){
            return await message.reply("<:error:888264104081522698>  You are not in my voice channel!");
          } else if (!client.player.getQueue(message.guild.id)){
            return await message.reply("<:error:888264104081522698>  There are no songs in the queue!");
          };

		let bar = queue.createProgressBar({
			timecodes: true,
			queue: false,
			length: 19,
		})

    const song = queue.current
    const currentQueue = client.player.getQueue(message.guildId);
    const volume = currentQueue.volume;
    const repeatMode = currentQueue.repeatMode;

		return await message.reply({
			embeds: [new EmbedBuilder()
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setFooter({ text: `Duration: ${song.duration}`, iconURL: client.user.displayAvatarURL({ dynamic: true })})
            .setThumbnail(song.thumbnail)
            .setDescription(`Currently Playing [${song.title}](${song.url})\n\n` + bar)
			.addFields(
				{ name: 'Requested by', value: song.requestedBy.username || 'None', inline: true },
				{ name: 'Volume', value: volume + '%' || 'None', inline: true },
			)
        ],
		})
}
}