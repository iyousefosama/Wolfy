const { SlashCommandBuilder } = require('@discordjs/builders');
const discord = require('discord.js');
const ms = require('ms')

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "seek",
    description: "Seek to the given time",
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
    options: [
      {
        type: 4, // INTEGER
        name: 'time',
        description: 'The time in seconds to seek to',
        required: true
      }
    ]
  },
  async execute(client, interaction) {
    const Tracktime = interaction.options.getInteger("time")
    const queue = client.player.getQueue(interaction.guildId)

    if (!interaction.member.voice.channel) {
      return await interaction.reply("<:error:888264104081522698> Sorry, you need to join a voice channel first to play a track!");
    } else if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
      return await interaction.reply("<:error:888264104081522698> You are not in my voice channel!");
    } else if (!client.player.getQueue(interaction.guild.id)) {
      return await interaction.reply("<:error:888264104081522698> There are no tracks in the queue!");
    };

    const time = ms(Tracktime);

    if (!time || time <= 0) {
      return await message.reply("<:error:888264104081522698> Please add a valid time to seek the track, i.e 3m");
    }
    await queue.seek(time);
    await interaction.reply(`:left_right_arrow: Seeked to ${Tracktime}(\`${time}s\`)!`)
  },
};