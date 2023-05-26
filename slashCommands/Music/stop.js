const { SlashCommandBuilder } = require('@discordjs/builders');
const discord = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');
const { QueryType } = require("discord-player")

module.exports = {
    clientpermissions: [discord.PermissionsBitField.Flags.EmbedLinks, discord.PermissionsBitField.Flags.ReadMessageHistory, discord.PermissionsBitField.Flags.Connect, discord.PermissionsBitField.Flags.Speak],
    guildOnly: true,
	data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stops the current track and clears the queue"),
	async execute(client, interaction) {
        const queue = client.player.getQueue(interaction.guildId)

        if (!interaction.member.voice.channel){
            return await interaction.editReply("<:error:888264104081522698> Sorry, you need to join a voice channel first to play a track!");
          } else if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId){
            return await interaction.editReply("<:error:888264104081522698> You are not in my voice channel!");
          } else if (!client.player.getQueue(interaction.guild.id)){
            return await interaction.editReply("<:error:888264104081522698> There are no tracks in the queue!");
          };

        queue.destroy()
        await interaction.editReply("<:Success:888264105851490355> **Successfully** cleared the queue!")
	},
};