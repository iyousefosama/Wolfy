const discord = require('discord.js')
//const lyricsFinder = require("lyrics-finder")
const fetch = require('node-fetch');
const { MessageEmbed, GuildEmoji } = require('discord.js');
const text = require('../../util/string');
const Page = require('../../util/Paginate');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: "lyrics",
    aliases: ["Lyrics", "LYRICS"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<lyrics title>',
    group: 'Search',
    description: 'The bot will show you the lyrics for the music you are searching for!',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    permissions: [],
    clientpermissions: ["USE_EXTERNAL_EMOJIS", "ADD_REACTIONS", "EMBED_LINKS"],
    examples: ['Venom'],
    async execute(client, message, args) {
    const query =  args.join(' ');

    if(!query) {
      return message.channel.send(`\\\❌ | ${message.author}, I couldn't find the lyrics!`)
    }

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
            .setAuthor({ name: `${data.title}\n${data.author}`, iconURL: null, url: data.links.genius })
            .setColor('GREY')
            .addFields(
                { name: '<:pp421:853495091338674206> Artist', value: `\`\`\`${data.author}\`\`\``, inline: true },
                { name: '<:pp421:853495091338674206> Song', value: `\`\`\`${data.title}\`\`\``, inline: true },
            )
            .setDescription(data.lyrics)
            .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL({dynamic: true, size: 2048}) })
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
            .setAuthor({ name: `${data.title}\n${data.author}`, iconURL: null, url: data.links.genius })
            .setColor('GREY')
            .addFields(
                { name: '<:pp421:853495091338674206> Artist', value: `\`\`\`${data.author}\`\`\``, inline: true },
                { name: '<:pp421:853495091338674206> Song', value: `\`\`\`${data.title}\`\`\``, inline: true },
            )
            .setDescription(x)
            .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL({dynamic: true, size: 2048})})
            .setTimestamp()
            )
        );
        const button = new MessageButton()
        .setLabel(`Prev`)
        .setCustomId("51984198419841941")
        .setStyle('PRIMARY')
        .setEmoji("890490643548352572");
        const button2 = new MessageButton()
        .setLabel(`Next`)
        .setCustomId("51984198419841942")
        .setStyle('PRIMARY')
        .setEmoji("890490558492061736")

        const row = new discord.MessageActionRow()
        .addComponents(button, button2)

        const msg = await message.channel.send({ content: `<:pp332:853495194863534081> **Page:** \`${pages.currentIndex+1}/${pages.size}\``, embeds: [pages.currentPage], components: [row] })

        const filter = i => i.user.id === message.author.id;

        const collector = msg.createMessageComponentCollector({ filter, fetch: true  })

        let timeout = setTimeout(()=> collector.stop(), 180000)
    
        collector.on('collect', async interactionCreate => {
          interactionCreate.deferUpdate()
          if (interactionCreate.customId === '51984198419841941') {
            msg.edit({ embeds: [pages.previous()], content: `<:pp332:853495194863534081> **Page:** \`${pages.currentIndex+1}/${pages.size}\`` })
          } else if(interactionCreate.customId === '51984198419841942') {
            msg.edit({ embeds: [pages.next()], content: `<:pp332:853495194863534081> **Page:** \`${pages.currentIndex+1}/${pages.size}\`` })
          }
    
          timeout.refresh()
        });

        collector.on('end', async () => {
          button.setDisabled(true)
          button2.setDisabled(true)
          const newrow = new MessageActionRow()
          .addComponents(button, button2);
          msg.edit({embeds: [pages.currentPage], components: [newrow]}).catch(() => null);
      });
    }/*else {
    let singer;
    let song;
    const filter = msg => msg.author.id === message.author.id;

    let singerEmb = new discord.MessageEmbed()
    .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({dynamic: true, size: 2048}) })
    .setColor(`#d6a565`)
    .setDescription(`<a:Loading:841321898302373909> | Please send the **artist** name!`)
    .setFooter({ text: `1/2 | type "cancel" to cancel the command`, iconURL: message.author.displayAvatarURL({dynamic: true, size: 2048}) })
    message.channel.send({ embeds: [singerEmb] })
    let col = await message.channel.awaitMessages({ filter, max: 1})
    if(col.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`lyrics\` command!`});
    else if(col.first().content == `${client.prefix}lyrics`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`lyrics\` command!`})
    singer = col.first().content

    let songEmb = new discord.MessageEmbed()
    .setColor(`#98ff98`)
    .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({dynamic: true, size: 2048}) })
    .setDescription(`<a:Loading:841321898302373909> | Please send the **song** name!`)
    .setFooter({ text: `2/2 | type "cancel" to cancel the command`, iconURL: message.author.displayAvatarURL({dynamic: true, size: 2048}) })
    message.channel.send({ embeds: [songEmb]})
    let col2 = await message.channel.awaitMessages({ filter, max: 1 })
    if(col2.first().content == 'cancel') return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`lyrics\` command!`});
    else if(col2.first().content == `${client.prefix}lyrics`) return message.channel.send({ content: `<:error:888264104081522698>  **|** **${message.author.tag}**, Cancelled the \`lyrics\` command!`})
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
        .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL({dynamic: true, size: 2048})})
        .setTimestamp()
        return message.channel.send({ embeds: [LowLy]})
        }
    }

    const lyrics_array = res.split('\n');
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
      .setAuthor({ name: `${data.title}\n${data.author}`, iconURL: null, url: data.links.genius })
      .setColor('GREY')
      .addFields(
          { name: '<:pp421:853495091338674206> Artist', value: `\`\`\`${data.author}\`\`\``, inline: true },
          { name: '<:pp421:853495091338674206> Song', value: `\`\`\`${data.title}\`\`\``, inline: true },
      )
      .setDescription(x)
      .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL({dynamic: true, size: 2048})})
      .setTimestamp()
      )
  );
  const button = new MessageButton()
  .setLabel(`Prev`)
  .setCustomId("51984198419841941")
  .setStyle('PRIMARY')
  .setEmoji("890490643548352572");
  const button2 = new MessageButton()
  .setLabel(`Next`)
  .setCustomId("51984198419841942")
  .setStyle('PRIMARY')
  .setEmoji("890490558492061736")

  const row = new discord.MessageActionRow()
  .addComponents(button, button2)

  const msg = await message.channel.send({ content: `<:pp332:853495194863534081> **Page:** \`${pages.currentIndex}/${pages.size}\``, embeds: [pages.currentPage], components: [row] })

  const filter1 = i => i.user.id === message.author.id;

  const collector = msg.createMessageComponentCollector({ filter1, fetch: true  })

  let timeout = setTimeout(()=> collector.stop(), 180000)

  collector.on('collect', async interactionCreate => {
    interactionCreate.deferUpdate()
    if (interactionCreate.customId === '51984198419841941') {
      msg.edit({ content: `<:pp332:853495194863534081> **Page:** \`${pages.currentIndex-1}/${pages.size}\``, embeds: [pages.previous()] })
    } else if(interactionCreate.customId === '51984198419841942') {
      msg.edit({ content: `<:pp332:853495194863534081> **Page:** \`${pages.currentIndex+1}/${pages.size}\``, embeds: [pages.next()] })
    }

    timeout.refresh()
  });

  collector.on('end', async () => {
    button.setDisabled(true)
    button2.setDisabled(true)
    const newrow = new MessageActionRow()
    .addComponents(button, button2);
    msg.edit({embeds: [pages.currentPage], components: [newrow]}).catch(() => null);
});
}*/
}
}