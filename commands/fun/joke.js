const discord = require('discord.js')
const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
  name: "joke",
  aliases: ["Joke", "JOKE"],
  dmOnly: false, //or false
  guildOnly: true, //or false
  args: false, //or false
  usage: '',
  group: 'Fun',
  description: 'The bot will tell you random joke from the api',
  cooldown: 3, //seconds(s)
  guarded: false, //or false
  permissions: [],
  clientPermissions: ["UseExternalEmojis", "ReadMessageHistory"],
  examples: [''],
  async execute(client, message, args) {
    const data = await fetch('https://sv443.net/jokeapi/v2/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist')
    .then(res => res.json())
    .catch(() => null);

    if (!data){
      return message.channel.send(`\\\❌ **${message.author.username}**, Server Error 5xx: Joke API is currently down!`);
    };

      const embed = new EmbedBuilder()
      .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL({dynamic: true, size: 2048}) })
      .setTimestamp()
      .setColor('738ADB')
      .setAuthor({ name: `Joke Title: ${data.category} Joke` })
      .setThumbnail('https://cdn-icons-png.flaticon.com/512/185/185034.png')
      .setDescription(data.type === 'twopart' ? `${data.setup}\n\n||${data.delivery}||` : data.joke)
      message.channel.send({ embeds: [embed]})
  }
}