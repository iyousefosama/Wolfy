const { SlashCommandBuilder } = require('@discordjs/builders');
const discord = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');
const { QueryType } = require("discord-player")

module.exports = {
    clientPermissions: [discord.PermissionsBitField.Flags.EmbedLinks, discord.PermissionsBitField.Flags.ReadMessageHistory, discord.PermissionsBitField.Flags.Connect, discord.PermissionsBitField.Flags.Speak],
    guildOnly: true,
	data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pause the current playing track"),
	async execute(client, interaction) {
        const queue = client.player.getQueue(interaction.guildId)

        if (!interaction.member.voice.channel){
            return await interaction.reply("<:error:888264104081522698> Sorry, you need to join a voice channel first to play a track!");
          } else if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId){
            return await interaction.reply("<:error:888264104081522698> You are not in my voice channel!");
          } else if (!client.player.getQueue(interaction.guild.id)){
            return await interaction.reply("<:error:888264104081522698> There are no tracks in the queue!");
          };

		queue.setPaused(true)
        await interaction.reply("⏸ **Music has been paused!** Use `/resume` to resume the music!")
	},
};