const { SlashCommandBuilder } = require('@discordjs/builders');
const discord = require('discord.js');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { QueryType } = require("discord-player")

module.exports = {
    clientpermissions: ['EMBED_LINKS', 'READ_MESSAGE_HISTORY', 'CONNECT', 'SPEAK'],
    guildOnly: true,
	data: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Set the volume for the current queue")
    .addIntegerOption((option) => 
    option.setName("volume").setDescription("Number of volume").setRequired(true)),
	async execute(client, interaction) {
        const vol = interaction.options.getNumber("volume")
        const queue = client.player.getQueue(interaction.guildId)

        if (!interaction.member.voice.channel){
            return await interaction.editReply("<:error:888264104081522698> Sorry, you need to join a voice channel first to play a song!");
          } else if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId){
            return await interaction.editReply("<:error:888264104081522698> You are not in my voice channel!");
          } else if (!client.player.getQueue(interaction.guild.id)){
            return await interaction.editReply("<:error:888264104081522698> There are no songs in the queue!");
          };

        if (!vol) return await interaction.editReply(`❌ Please add the volume, current volume is \`${queue.volume}\`!`)
        if (vol < 0 || vol > 100) return void ctx.sendFollowUp({ content: '❌ Volume range must be \`1-100\`!' });
        const success = queue.setVolume(vol);
        await interaction.editReply({ content: success ? `<:success:888264105851490355> **Successfully** set the volume to \`${vol}%\`!` : '<:error:888264104081522698> Something went wrong!'})
	},
};