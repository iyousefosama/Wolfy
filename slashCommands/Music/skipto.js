const { SlashCommandBuilder } = require('@discordjs/builders');
const discord = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');
const { QueryType } = require("discord-player")

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "skipto",
    description: "Skips the current track to a certain track",
    dmOnly: false,
    guildOnly: true,
    cooldown: 0,
    group: "NONE",
    clientPermissions: [
        discord.PermissionsBitField.Flags.EmbedLinks,
        discord.PermissionsBitField.Flags.ReadMessageHistory,
        discord.PermissionsBitField.Flags.Connect,
        discord.PermissionsBitField.Flags.Speak
    ],
    permissions: [],
    options: [
        {
            type: 10, // NUMBER
            name: 'tracknumber',
            description: 'The track number to skip to',
            required: true
        }
    ]
},
	async execute(client, interaction) {
        const queue = client.player.getQueue(interaction.guildId)

        if (!interaction.member.voice.channel){
            return await interaction.reply("<:error:888264104081522698> Sorry, you need to join a voice channel first to play a track!");
          } else if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId){
            return await interaction.reply("<:error:888264104081522698> You are not in my voice channel!");
          } else if (!client.player.getQueue(interaction.guild.id)){
            return await interaction.reply("<:error:888264104081522698> There are no tracks in the queue!");
          };

        const trackNum = interaction.options.getNumber("tracknumber")
        if (trackNum > queue.tracks.length) return await interaction.reply("<:error:888264104081522698> Invalid track number!")
        if (trackNum < 1) return await interaction.reply("<:error:888264104081522698> Invalid track number!")
		queue.skipTo(trackNum - 1)

        await interaction.reply(`<:Success:888264105851490355> **Successfully** skipped to the track number \`${trackNum}\`!`)
	},
};