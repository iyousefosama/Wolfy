const { SlashCommandBuilder } = require('@discordjs/builders');
const discord = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');
const { QueryType } = require("discord-player")

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "pause",
    description: "Pause the currently playing track",
    dmOnly: false,
    guildOnly: true,
    cooldown: 0,
    group: "NONE",
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

    if (!interaction.member.voice.channel) {
      return await interaction.reply("<:error:888264104081522698> Sorry, you need to join a voice channel first to play a track!");
    } else if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
      return await interaction.reply("<:error:888264104081522698> You are not in my voice channel!");
    } else if (!client.player.getQueue(interaction.guild.id)) {
      return await interaction.reply("<:error:888264104081522698> There are no tracks in the queue!");
    };

    queue.setPaused(true)
    await interaction.reply("⏸ **Music has been paused!** Use `/resume` to resume the music!")
  },
};