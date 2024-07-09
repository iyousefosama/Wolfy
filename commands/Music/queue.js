const discord = require('discord.js');
const { MessageActionRow, MessageButton, EmbedBuilder } = require('discord.js');
const { QueryType } = require("discord-player")

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
    name: "queue",
    aliases: ["Queue", "QUEUE"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '(Optional: Page number)',
    group: 'Music',
    description: 'Displays the current track queue',
    cooldown: 3, //seconds(s)
    guarded: false, //or false
    permissions: [],
    clientPermissions: ["Connect", "Speak"],
    examples: [
        '',
        '3'
      ],
      
    async execute(client, message, [pageNum]) {
        const queue = client.player.getQueue(message.guildId)

        if (!message.member.voice.channel){
            return await message.reply("<:error:888264104081522698> Sorry, you need to join a voice channel first to play a song!");
          } else if (message.guild.members.me.voice.channelId && message.member.voice.channelId !== message.guild.members.me.voice.channelId){
            return await message.reply("<:error:888264104081522698> You are not in my voice channel!");
          } else if (!client.player.getQueue(message.guild.id)){
            return await message.reply("<:error:888264104081522698> There are no songs in the queue!");
          };

        const totalPages = Math.ceil(queue.tracks.length / 10) || 1
        const page = (pageNum || 1) - 1

        if (page > totalPages || page < 0) 
            return await message.reply(`<:error:888264104081522698> **Invalid Page.** There are only a total of \`${totalPages}\` pages of songs!`)
        
        const queueString = queue.tracks.slice(page * 10, page * 10 + 10).map((song, i) => {
            return `**${page * 10 + i + 1}.** \`[${song.duration}]\` ${song.title} -- <@${song.requestedBy.id}>`
        }).join("\n")

        const currenttrack = queue.current

        await message.reply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                    .setDescription(`<a:Fire:887894604421160970> **Currently Playing**\n` + 
                    (currenttrack ? `\`[${currenttrack.duration}]\` ${currenttrack.title} -- <@${currenttrack.requestedBy.id}>` : "None") +
                    `\n\n<:star:888264104026992670> **Queue**\n${queueString}`
                    )
                    .setFooter({
                        text: `Page ${page + 1} of ${totalPages}`
                    })
                    .setThumbnail(currenttrack.setThumbnail)
            ]
        })
}
}