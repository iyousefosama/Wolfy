const discord = require('discord.js')
const lyricsFinder = require("lyrics-finder")
const { prefix } = require('../../config.json');
const fetch = require('node-fetch');
const { MessageEmbed, GuildEmoji } = require('discord.js');
const text = require('../../util/string');
const Page = require('../../util/Paginate');

module.exports = {
    name: "lyrics",
    aliases: ["Lyrics", "LYRICS"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    group: 'Search',
    description: 'The bot will show you the lyrics for the music you are searching for!',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    permissions: [],
    clientpermissions: ["USE_EXTERNAL_EMOJIS", "ADD_REACTIONS", "EMBED_LINKS"],
    examples: [],
    async execute(client, message, args) {
    const query =  args[0].join(' ');
    if (message.author == client.user) return;
    if(query) {
        message.channel.sendTyping()
        const data = await fetch(`https://some-random-api.ml/lyrics?title=${encodeURI(query)}`)
        .then(res => res.json())
        .catch(() => null);
    
        if (!data || data.error){
            return message.channel.send(`\\\❌ | ${message.author}, I couldn't find the lyrics!`)
          };
    
        if (data.lyrics.length < 2000){
            const LowLy = new discord.MessageEmbed()
            .setThumbnail(data.thumbnail.genius)
            .setAuthor(`${data.title}\n${data.author}`, null, data.links.genius)
            .setColor('GREY')
            .addFields(
                { name: '<:pp421:853495091338674206> Artist', value: `\`\`\`${data.author}\`\`\``, inline: true },
                { name: '<:pp421:853495091338674206> Song', value: `\`\`\`${data.title}\`\`\``, inline: true },
            )
            .setDescription(data.lyrics)
            .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true, size: 2048}))
            .setTimestamp()
            return message.channel.send({ embeds: [LowLy]})
        } else {
        message.channel.sendTyping()
        const lyrics_array = data.lyrics.split('\n');
        const lyrics_subarray = [ '' ];
        let n = 0;
    
        for (const line of lyrics_array){
          if (lyrics_subarray[n].length + line.length < 2000){
            lyrics_subarray[n] = lyrics_subarray[n] + line + '\n'
          } else {
            n++
            lyrics_subarray.push(line);
          };
        };
    
        const pages = new Page(
            lyrics_subarray.map((x,i) =>
              new MessageEmbed()
            .setThumbnail(data.thumbnail.genius)
            .setAuthor(`${data.title}\n${data.author}`, null, data.links.genius)
            .setColor('GREY')
            .addFields(
                { name: '<:pp421:853495091338674206> Artist', value: `\`\`\`${data.author}\`\`\``, inline: true },
                { name: '<:pp421:853495091338674206> Song', value: `\`\`\`${data.title}\`\`\``, inline: true },
            )
            .setDescription(x)
            .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true, size: 2048}))
            .setTimestamp()
            )
        );

        const msg = await message.channel.send({ embeds: [pages.currentPage] })
          
        const prev = client.emojis.cache.get('890490643548352572') || '◀';
        const next = client.emojis.cache.get('890490558492061736') || '▶';
        const terminate = client.emojis.cache.get('888264104081522698') || '❌';
        const filter = (reaction, user) => user.id === message.author.id;

        const collector = msg.createReactionCollector({ filter })
        const navigators = [ prev, next, terminate ]

        for (let i = 0; i < navigators.length; i++) {
            await new Promise(r=>setTimeout(r,1500))
            await msg.react(navigators[i])
        }

        let timeout = setTimeout(()=> collector.stop(), 180000)
    
        collector.on('collect', async ( {emoji: {name}, users }) => {
    
        switch(name){
          case prev instanceof GuildEmoji ? prev.name : prev:
            msg.edit({ embeds: [pages.previous()] })
            break
          case next instanceof GuildEmoji ? next.name : next:
            msg.edit({ embeds: [pages.next()] })
            break
          case terminate instanceof GuildEmoji ? terminate.name : terminate:
            collector.stop()
            break
          }
    
          await users.remove(message.author.id)
          timeout.refresh()
        });
        collector.on('end', async () => await msg.reactions.removeAll().catch(()=>null) ? null : null);
}
    } else {


    let singer;
    let song;
    let pages = []
    let current = 0

    const filter = msg => msg.author.id == message.author.id;

    let singerEmb = new discord.MessageEmbed()
    .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true, size: 2048}))
    .setColor(`#d6a565`)
    .setDescription(`<a:Loading:841321898302373909> | Please send the **artist** name!`)
    .setFooter(`1/2 | type "cancel" to cancel the command`, message.author.displayAvatarURL({dynamic: true, size: 2048}))
    message.channel.send({ embeds: [singerEmb] })
    let col = await message.channel.awaitMessages({ filter, max: 1})
    if(col.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`lyrics\` command!`});
    else if(col.first().content == `${prefix}lyrics`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`lyrics\` command!`})
    singer = col.first().content

    let songEmb = new discord.MessageEmbed()
    .setColor(`#98ff98`)
    .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true, size: 2048}))
    .setDescription(`<a:Loading:841321898302373909> | Please send the **song** name!`)
    .setFooter(`2/2 | type "cancel" to cancel the command`, message.author.displayAvatarURL({dynamic: true, size: 2048}))
    message.channel.send({ embeds: [songEmb]})
    let col2 = await message.channel.awaitMessages({ filter, max: 1 })
    if(col2.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`lyrics\` command!`});
    else if(col2.first().content == `${prefix}lyrics`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`lyrics\` command!`})
    song = col2.first().content
    message.channel.sendTyping()

    const data = await fetch(`https://some-random-api.ml/lyrics?title=${encodeURI(song)}`)
    .then(res => res.json())
    .catch(() => null);

    if (!data || data.error){
        return message.channel.send(`\\\❌ | ${message.author}, I couldn't find the lyrics!`)
      };

    let res = await lyricsFinder(singer, song) || `\\\❌ | ${message.author}, I couldn't find the lyrics!`;

    if (data.lyrics.length < 2000){
        for(let i = 0; i < res.length; i += 2048) {
            let lyrics = res.substring(i, Math.min(res.length, i + 2048))
        const LowLy = new discord.MessageEmbed()
        .setThumbnail(data.thumbnail.genius)
        .setAuthor(`${data.title}\n${data.author}`, null, data.links.genius)
        .setColor('GREY')
        .addFields(
            { name: '<:pp421:853495091338674206> Artist', value: `\`\`\`${data.author}\`\`\``, inline: true },
            { name: '<:pp421:853495091338674206> Song', value: `\`\`\`${data.title}\`\`\``, inline: true },
        )
        .setDescription(lyrics)
        .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true, size: 2048}))
        .setTimestamp()
        return message.channel.send({ embeds: [LowLy]})
        }
    }

    for(let i = 0; i < res.length; i += 2048) {
        let lyrics = res.substring(i, Math.min(res.length, i + 2048))
        let page = new discord.MessageEmbed()
        .setThumbnail(data.thumbnail.genius)
        .setAuthor(`${data.title}\n${data.author}`, null, data.links.genius)
        .setColor('GREY')
        .addFields(
            { name: '<:pp421:853495091338674206> Artist', value: `\`\`\`${data.author}\`\`\``, inline: true },
            { name: '<:pp421:853495091338674206> Song', value: `\`\`\`${data.title}\`\`\``, inline: true },
        )
        .setDescription(lyrics)
        .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true, size: 2048}))
        .setTimestamp()
        pages.push(page)
    }

    const filter2 = (reaction, user) => ['⬅️', '➡️', '❌'].includes(reaction.emoji.name) && (message.author.id == user.id)
    const Embed = await message.channel.send({ content: `<:pp332:853495194863534081> **Page:** \`${current+1}/${pages.length}\``, embeds: [pages[current]]})
    const navigators = [ '⬅️', '➡️', '❌' ];

    for (let i = 0; i < navigators.length; i++) {
      await new Promise(r=>setTimeout(r,1500))
      await Embed.react(navigators[i])
    };


    let ReactionCol = Embed.createReactionCollector({ filter: filter2, time: 30000 })

    ReactionCol.on("collect", (reaction, user) => {
        reaction.users.remove(message.author.id)

        if(reaction.emoji.name == '➡️') {
            if(current < pages.length - 1) {
                current += 1
                Embed.edit({ content: `<:pp332:853495194863534081> **Page:** \`${current+1}/${pages.length}\``, embeds: [pages[current]]})
            }
        } else {
            if(reaction.emoji.name === '⬅️') {
                if(current !== 0) {
                    current -= 1
                    Embed.edit({ content: `<:pp332:853495194863534081> **Page:** \`${current+1}/${pages.length}\``, embeds: [pages[current]]})
                }
            } else if(reaction.emoji.name == '❌') {
                Embed.reactions.removeAll().catch(()=>null)
            }
        }
    })
    ReactionCol.on('end', async () => await Embed.reactions.removeAll().catch(()=>null) ? null : null);
}
}
}