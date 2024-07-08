const discord = require('discord.js');
const { MessageActionRow, MessageButton, EmbedBuilder } = require('discord.js');
const { QueryType } = require("discord-player")
const playdl = require("play-dl");

module.exports = {
    name: "play",
    aliases: ["Play", "PLAY", "p"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<Song>',
    group: 'Music',
    description: 'Plays tracks on discord voice channel from other platforms',
    cooldown: 3, //seconds(s)
    guarded: false, //or false
    permissions: [],
    clientPermissions: [discord.PermissionsBitField.Flags.Connect, discord.PermissionsBitField.Flags.Speak],
    examples: [
        'Story Nights',
        'https://youtube.com/..'
      ],
    async execute(client, message, [music]) {
        if (!message.member.voice.channel){
            return await message.reply("<:error:888264104081522698> Sorry, you need to join a voice channel first to play a song!");
          } else if (message.guild.members.me.voice.channelId && message.member.voice?.channelId !== message.guild.members.me.voice.channelId){
            return await message.reply("<:error:888264104081522698> You are not in my voice channel!");
          };

        const guild = client.guilds.cache.get(message.guild.id);
        const channel = guild.channels.cache.get(message.channel.id);
        const OldQueue = client.player.getQueue(message.guild.id);
        let queue;
        
        if(!OldQueue) {
            queue = await client.player?.createQueue(guild, {
                metadata: {
                    channel: channel
                },
                async onBeforeCreateStream(track, source, _queue) {
                    return (await playdl.stream(track.url, { discordPlayerCompatibility : true })).stream;
                },
            })

            queue.connect()
        } else {
            queue = OldQueue
        }

        if(!music) {
            return message.reply({ content: "<:error:888264104081522698> Please type a valid song!" })
        }
        
        const result = await client.player.search(music, {
            requestedBy: message.author,
            searchEngine: QueryType.AUTO
        })
        if (result.tracks.length === 0)
            return await message.reply({ content: "<:error:888264104081522698> No results found for this url!" })
        
        const song = result.tracks[0]
        await queue.addTrack(song)
        const embed = new EmbedBuilder()
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
            .setThumbnail(song.thumbnail)
            .setFooter({ text: `Duration: ${song.duration}`, iconURL: client.user.displayAvatarURL({ dynamic: true })})
            if (!queue.playing) await queue.play()
            
            return await message.channel.send({
                embeds: [embed]
            })
}
}