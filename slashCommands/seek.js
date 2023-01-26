const { SlashCommandBuilder } = require('@discordjs/builders');
const discord= require('discord.js');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');
const { QueryType } = require("discord-player")

module.exports = {
    clientpermissions: [discord.PermissionsBitField.Flags.EmbedLinks, discord.PermissionsBitField.Flags.ReadMessageHistory, discord.PermissionsBitField.Flags.Connect, discord.PermissionsBitField.Flags.Speak],
    guildOnly: true,
	data: new SlashCommandBuilder()
    .setName("seek")
    .setDescription("Seek to the given time")
    .addIntegerOption((option) => 
    option.setName("time").setDescription("The song to skip to").setRequired(true)),
	async execute(client, interaction) {
        const Tracktime = interaction.options.getInteger("time")
        const queue = client.player.getQueue(interaction.guildId)

        if (!interaction.member.voice.channel){
            return await interaction.editReply("<:error:888264104081522698> Sorry, you need to join a voice channel first to play a song!");
          } else if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId){
            return await interaction.editReply("<:error:888264104081522698> You are not in my voice channel!");
          } else if (!client.player.getQueue(interaction.guild.id)){
            return await interaction.editReply("<:error:888264104081522698> There are no songs in the queue!");
          };

        const time = Tracktime * 1000;
        await queue.seek(time);
        await interaction.editReply(`:left_right_arrow: Seeked to ${time / 1000} seconds!`)
	},
};