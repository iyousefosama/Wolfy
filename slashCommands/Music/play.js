const { SlashCommandBuilder } = require("@discordjs/builders");
const discord = require("discord.js");
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");
const { QueryType } = require("discord-player");
const playdl = require("play-dl");

module.exports = {
  clientPermissions: [
    discord.PermissionsBitField.Flags.EmbedLinks,
    discord.PermissionsBitField.Flags.ReadMessageHistory,
    discord.PermissionsBitField.Flags.Connect,
    discord.PermissionsBitField.Flags.Speak,
  ],
  guildOnly: true,
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription(
      "Plays tracks on discord voice channel from other platforms"
    )
    .addStringOption((option) =>
      option
        .setName("track")
        .setDescription(
          "Search for a track in different platforms by url or name"
        )
        .setRequired(true)
    ),
  async execute(client, interaction) {
    await interaction.deferReply().catch(() => {});
    const trackInput = interaction.options.getString("track");

    if (!interaction.member.voice.channel) {
      return await interaction.reply(
        "<:error:888264104081522698> Sorry, you need to join a voice channel first to play a track!"
      );
    } else if (
      interaction.guild.members.me.voice.channelId &&
      interaction.member.voice.channelId !==
        interaction.guild.members.me.voice.channelId
    ) {
      return await interaction.editReply(
        "<:error:888264104081522698> You are not in my voice channel!"
      ).catch(() => {});
    }

    // verifies song is not a spotify link
    if (trackInput.includes("spotify"))
      return interaction.editReply({
        content: `Spotify not supported ❌`,
        ephemeral: true,
      }).catch(() => {});

    const guild = client.guilds.cache.get(interaction.guild.id);
    const channel = guild.channels.cache.get(interaction.channel.id);
    const OldQueue = client.player.getQueue(interaction.guild.id);
    let queue;

    if (!OldQueue) {
      queue = await client.player?.createQueue(interaction.guild, {
        metadata: {
          channel: channel,
        },
        async onBeforeCreateStream(track, source, _queue) {
          return (
            await playdl.stream(track.url, { discordPlayerCompatibility: true })
          ).stream;
        },
      });
    } else {
      queue = OldQueue;
    }

    let embed = new EmbedBuilder();

    const result = await client.player.search(trackInput, {
      requestedBy: interaction.user,
      searchEngine: QueryType.AUTO,
    });

    if (result.tracks.length === 0)
      return await interaction.editReply(
        "<:error:888264104081522698> No results found for this track name!"
      ).catch(() => {});

    const track = result.tracks[0];
    await queue.addTrack(track);
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
  },
};
