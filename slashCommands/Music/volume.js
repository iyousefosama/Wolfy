const { SlashCommandBuilder } = require('@discordjs/builders');
const discord = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');
const { QueryType } = require("discord-player")

module.exports = {
    clientpermissions: [discord.PermissionsBitField.Flags.EmbedLinks, discord.PermissionsBitField.Flags.ReadMessageHistory, discord.PermissionsBitField.Flags.Connect, discord.PermissionsBitField.Flags.Speak],
    guildOnly: true,
	data: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Set the volume for the current queue")
    .addIntegerOption((option) => 
    option.setName("volume").setDescription("Number of volume").setRequired(true)),
	async execute(client, interaction) {
        const vol = interaction.options.getInteger("volume")
        const queue = client.player.getQueue(interaction.guildId)

        if (!interaction.member.voice.channel){
            return await interaction.reply("<:error:888264104081522698> Sorry, you need to join a voice channel first to play a track!");
          } else if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId){
            return await interaction.reply("<:error:888264104081522698> You are not in my voice channel!");
          } else if (!client.player.getQueue(interaction.guild.id)){
            return await interaction.reply("<:error:888264104081522698> There are no tracks in the queue!");
          };

        if (!vol) return await interaction.reply(`❌ Please add the volume, current volume is \`${queue.volume}\`!`)
        if (vol < 0 || vol > 100) return await interaction.reply({ content: '❌ Volume range must be \`1-100\`!' });
        const Success = queue.setVolume(vol);
        await interaction.reply({ content: Success ? `<:Success:888264105851490355> **Successfully** set the volume to \`${vol}%\`!` : '<:error:888264104081522698> Something went wrong!'})
	},
};