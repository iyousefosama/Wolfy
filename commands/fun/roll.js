const discord = require('discord.js');
const text = require('../../util/string');

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
  name: "roll",
  aliases: ["Roll", "ROLL"],
  dmOnly: false, //or false
  guildOnly: true, //or false
  args: false, //or false
  usage: '(Optional: Number)',
  group: 'Fun',
  description: 'Let\'s flip the coin!',
  cooldown: 3, //seconds(s)
  guarded: false, //or false
  permissions: [],
  clientPermissions: [discord.PermissionsBitField.Flags.UseExternalEmojis, discord.PermissionsBitField.Flags.ReadMessageHistory],
  examples: [
      '10',
      '600',
      '1568'
    ],
    
  async execute(client, message, [tail]) {

    const rand = Math.random();
    tail = Math.round(tail) || Math.round(Math.random() * 999) + 1;

    const embed = new discord.EmbedBuilder()
    .setColor('#2F3136')
    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({dynamic: true, size: 2048}) })
    .setDescription(`\`\`\`${text.commatize(Math.round(rand * tail))}\`\`\``)
    .setFooter({ text: `(0  ❯  ${text.commatize(tail)})` })
    .setTimestamp()
    return message.reply({ content: `> **${message.author.username}**, Successfully rolled a random number!`, embeds: [embed]})
  }
}