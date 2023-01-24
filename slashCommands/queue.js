const { SlashCommandBuilder } = require('@discordjs/builders');
const discord= require('discord.js');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');
const { QueryType } = require("discord-player")

module.exports = {
    clientpermissions: ['EMBED_LINKS', 'READ_MESSAGE_HISTORY', 'CONNECT', 'SPEAK'],
    guildOnly: true,
	data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Displays the current song queue")
    .addNumberOption(option => option.setName('page').setDescription('Page number of the queue')),
	async execute(client, interaction) {
        const queue = client.player.getQueue(interaction.guildId)
        if (!interaction.member.voice.channel){
            return await interaction.editReply("<:error:888264104081522698> Sorry, you need to join a voice channel first to play a song!");
          } else if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId){
            return await interaction.editReply("<:error:888264104081522698> You are not in my voice channel!");
          } else if (!client.player.getQueue(interaction.guild.id)){
            return await interaction.editReply("<:error:888264104081522698> There are no songs in the queue!");
          };

        const totalPages = Math.ceil(queue.tracks.length / 10) || 1
        const page = (interaction.options.getNumber("page") || 1) - 1

        if (page > totalPages) 
            return await interaction.editReply(`<:error:888264104081522698> **Invalid Page.** There are only a total of \`${totalPages}\` pages of songs!`)
        
        const queueString = queue.tracks.slice(page * 10, page * 10 + 10).map((song, i) => {
            return `**${page * 10 + i + 1}.** \`[${song.duration}]\` ${song.title} -- <@${song.requestedBy.id}>`
        }).join("\n")

        const currentSong = queue.current

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                    .setDescription(`<a:Fire:887894604421160970> **Currently Playing**\n` + 
                    (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title} -- <@${currentSong.requestedBy.id}>` : "None") +
                    `\n\n<:star:888264104026992670> **Queue**\n${queueString}`
                    )
                    .setFooter({
                        text: `Page ${page + 1} of ${totalPages}`
                    })
                    .setThumbnail(currentSong.setThumbnail)
            ]
        })
	},
};