const discord = require('discord.js')
const lyricsFinder = require("lyrics-finder")

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return
    if(!message.guild.me.permissions.has('SEND_MESSAGES', 'EMBED_LINKS', 'USE_EXTERNAL_EMOJIS')) return;
    let singer;
    let song;
    let pages = []
    let current = 0

    const filter = msg => msg.author.id == message.author.id;
    let options = {
        max: 1
    };


    let mentionedMember = message.member;
    let singerEmb = new discord.MessageEmbed()
    .setColor(`GOLD`)
    .setDescription(`<a:Loading:841321898302373909> **Who is the singer?**`)
    .setFooter(`1/2`)
    message.channel.send(singerEmb)
    let col = await message.channel.awaitMessages(filter, options)
    if(col.first().content == 'cancel') return message.channel.send("Cancelled");
    singer = col.first().content

    let songEmb = new discord.MessageEmbed()
    .setColor(`GREEN`)
    .setDescription(`<a:Loading:841321898302373909> **What is the name of the song?**`)
    .setFooter(`2/2`)
    message.channel.send(songEmb)
    let col2 = await message.channel.awaitMessages(filter, options)
    if(col2.first().content == 'cancel') return message.channel.send("Cancelled");
    song = col2.first().content

    let res = await lyricsFinder(singer, song) || "Not Found"

    for(let i = 0; i < res.length; i += 2048) {
        let lyrics = res.substring(i, Math.min(res.length, i + 2048))
        let page = new discord.MessageEmbed()
        .setAuthor(`${mentionedMember.user.username}`, mentionedMember.user.displayAvatarURL({dynamic: true, size: 2048}))
        .addFields(
            { name: '<:pp421:853495091338674206> Singer', value: `\`\`\`${singer}\`\`\``, inline: true },
            { name: '<:pp421:853495091338674206> Song', value: `\`\`\`${song}\`\`\``, inline: true },
        )
        .setDescription(lyrics)
        pages.push(page)
    }

    const filter2 = (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && (message.author.id == user.id)
    const Embed = await message.channel.send(`<:pp332:853495194863534081> **Page:** \`${current+1}/${pages.length}\``, pages[current])
    await Embed.react('⬅️')
    await Embed.react('➡️')

    let ReactionCol = Embed.createReactionCollector(filter2)

    ReactionCol.on("collect", (reaction, user) => {
        reaction.users.remove(reaction.users.cache.get(message.author.id))

        if(reaction.emoji.name == '➡️') {
            if(current < pages.length - 1) {
                current += 1
                Embed.edit(`<:pp332:853495194863534081> **Page:** \`${current+1}/${pages.length}\``, pages[current])
            }
        } else {
            if(reaction.emoji.name === '⬅️') {
                if(current !== 0) {
                    current -= 1
                    Embed.edit(`<:pp332:853495194863534081> **Page:** \`${current+1}/${pages.length}\``, pages[current])
                }
            }
        }
    })


}

module.exports.help = {
    name: 'lyrics',
    aliases: []
}