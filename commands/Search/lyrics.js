const discord = require('discord.js')
const { EmbedBuilder } = require('discord.js');
const Page = require('../../util/Paginate');
const { ActionRowBuilder, ButtonBuilder } = require('discord.js');

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
    name: "lyrics",
    aliases: [],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<lyrics title>',
    group: 'Search',
    description: 'The bot will show you the lyrics for the music you are searching for!',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    permissions: [],
    clientPermissions: ["UseExternalEmojis", "AddReactions", "EmbedLinks"],
    examples: ['Venom'],

  async execute(client, message, args) {
    const fetch = (await import("node-fetch")).default;
    const query = args.join(' ');

    if(!query) {
      return message.channel.send(`\\\❌ | ${message.author}, I couldn't find the lyrics!`)
    }

        message.channel.sendTyping()
        const data = await fetch(`https://some-random-api.com/others/lyrics?title=${encodeURI(query)}`)
        .then(res => res.json())
        .catch(() => null);
    
        if (!data || data.error){
            return message.channel.send(`\\\❌ | ${message.author}, I couldn't find the lyrics!`)
          };
    
        if (data.lyrics.length < 2000){
            const LowLy = new discord.EmbedBuilder()
            .setThumbnail(data.thumbnail.genius)
            .setAuthor({ name: `${data.title}\n${data.author}`, iconURL: null, url: data.links.genius })
            .setColor('Grey')
            .addFields(
                { name: '<:pp421:853495091338674206> Artist', value: `\`\`\`${data.author}\`\`\``, inline: true },
                { name: '<:pp421:853495091338674206> Track', value: `\`\`\`${data.title}\`\`\``, inline: true },
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
              new EmbedBuilder()
            .setThumbnail(data.thumbnail.genius)
            .setAuthor({ name: `${data.title}\n${data.author}`, iconURL: null, url: data.links.genius })
            .setColor('Grey')
            .addFields(
                { name: '<:pp421:853495091338674206> Artist', value: `\`\`\`${data.author}\`\`\``, inline: true },
                { name: '<:pp421:853495091338674206> track', value: `\`\`\`${data.title}\`\`\``, inline: true },
            )
            .setDescription(x)
            .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL({dynamic: true, size: 2048})})
            .setTimestamp()
            )
        );
        const button = new ButtonBuilder()
        .setLabel(`Prev`)
        .setCustomId("51984198419841941")
        .setStyle('Primary')
        .setEmoji("890490643548352572");
        const button2 = new ButtonBuilder()
        .setLabel(`Next`)
        .setCustomId("51984198419841942")
        .setStyle('Primary')
        .setEmoji("890490558492061736")

        const row = new discord.ActionRowBuilder()
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
          const newrow = new ActionRowBuilder()
          .addComponents(button, button2);
          msg.edit({embeds: [pages.currentPage], components: [newrow]}).catch(() => null);
      });
    }
}
}