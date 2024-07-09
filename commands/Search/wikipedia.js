const discord = require('discord.js');
const { EmbedBuilder } = require('discord.js') // npm i discord.js
const fetch = require('node-fetch') // npm i node-fetch

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
    name: "wikipedia",
    aliases: ["wiki", "WIKI", "Wiki"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<query>',
    group: 'Search',
    description: 'To search for anything in wikipedia',
    cooldown: 3, //seconds(s)
    guarded: false, //or false
    permissions: [],
    clientPermissions: ["EmbedLinks", "UseExternalEmojis"],
    examples: [
        'Iphone 6',
        'discord'
      ],

  async execute(client, message, args) {
    if(message.channel.nsfw === false) return message.reply(`\\❌ **${message.author.tag}**, Sorry but you can use this command in nsfw channels only!`)
    const wiki = args.join(' ');
    if(!wiki) return message.reply('\\❌ Provide A Query To Search.') // If No Topic Provided To Searched
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wiki)}` // From Here BOT Will Search For Searched Topic

    let response
    try {
        response = await fetch(url).then(res => res.json()) // Getting Result
    }      
    catch (e) {
        return message.reply({ content: '\\❌ An Error Occured, Try Again.'}) // If Error Occur's
    }

    console.log(response)
    try {
        if(response.type === 'disambiguation') { // If Their Are Many Results With Same Searched Topic
            const embed = new EmbedBuilder()
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setColor(0x7289DA)
            .setTitle(response.title) // Title Of Topic
            .setURL(response.content_urls.desktop.page) // URL Of Searched Topic
            .setDescription([`
            ${response.extract}
            Links For Topic You Searched [Link](${response.content_urls.desktop.page}).`])
            .setTimestamp()
            .setFooter({ text: message.author.tag + ` | \©️${new Date().getFullYear()} Wolfy`, iconURL: message.author.avatarURL({dynamic: true}) })
            message.channel.send({ embeds: [embed] })
        }
        else { // If Only One Result
            const embed = new EmbedBuilder()
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setColor(0x7289DA)
            .setTitle(response.title) // Title Of Topic
            .setURL(response.content_urls.desktop.page) // URL Of Searched Topic
            .setThumbnail(response.thumbnail.source)
            .setDescription(response.extract)
            .setTimestamp()
            .setFooter({ text: `Wiki cmd | \©️${new Date().getFullYear()} Wolfy`, iconURL: client.user.avatarURL({dynamic: true}) })
            message.channel.send({ embeds: [embed] })
        }
    }
    catch {
        return message.reply({ content: `\\❌ ${message.author}, Provide A Valid Query To Search.`}) // If Searched Topic Is Not Available
    }
}
}