const { EmbedBuilder } = require('discord.js');
const { QueryType } = require("discord-player")

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
    name: "play",
    aliases: ["p"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<Song>',
    group: 'Music',
    description: 'Plays tracks on discord voice channel from other platforms',
    cooldown: 3, //seconds(s)
    guarded: false, //or false
    permissions: [],
    clientPermissions: ["Connect", "Speak"],
    examples: [
        'Story Nights',
        'https://youtube.com/..'
    ],
    
    async execute(client, message, [music]) {
        if (!message.member.voice.channel) {
            return await message.reply("<:error:888264104081522698> Sorry, you need to join a voice channel first to play a song!");
        } else if (message.guild.members.me.voice.channelId && message.member.voice?.channelId !== message.guild.members.me.voice.channelId) {
            return await message.reply("<:error:888264104081522698> You are not in my voice channel!");
        };

        const guild = client.guilds.cache.get(interaction.guild.id);
        const channel = guild.channels.cache.get(interaction.channel.id);
        const OldQueue = client.player.getQueue(interaction.guild.id);
        let queue;
    
        if (!OldQueue) {
          queue = await client.player?.createQueue(interaction.guild, {
            metadata: {
              channel: channel,
            },
    /*         async onBeforeCreateStream(track, source, _queue) {
              return (
                await playdl.stream(track.url, { discordPlayerCompatibility: true })
              ).stream;
            }, */
          });
        } else {
          queue = OldQueue;
        }
    
        const embed = new EmbedBuilder();
    
        const result = await client.player.search(trackInput, {
          requestedBy: interaction.user,
          searchEngine: QueryType.AUTO,
        });
    
        if (result.tracks.length === 0)
          return await interaction.editReply(
            "<:error:888264104081522698> No results found for this track name!"
          ).catch(() => {});
    
        const track = result.tracks[0];
        queue.addTrack(track); // This should ensure the track is added to the queue
        embed
          .setAuthor({
            name: interaction.user.tag,
            iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
          })
          .setDescription(
            `**[${track.title}](${track.url})** has been added to the Queue`
          )
          .setThumbnail(track.thumbnail)
          .setFooter({
            text: `Duration: ${track.duration}`,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          });
    
        try {
          if (!queue.connection) {
            await queue.connect(interaction.member.voice.channel);
          }
        } catch {
          client.player.deleteQueue(interaction.guild);
          return await interaction.editReply({
            content: "Could not join your voice channel!",
          }).catch(() => {});
        }
    
        if (!queue.playing) await queue.play();
    
        return await interaction.editReply({
          embeds: [embed],
        }).catch(() => {});
    }
}