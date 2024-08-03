const discord = require('discord.js')

/**
 * @type {import("../../util/types/baseCommand")}
*/
module.exports = {
  name: "uptime",
  aliases: [],
  dmOnly: false, //or false
  guildOnly: false, //or false
  args: false, //or false
  usage: '',
  group: 'bot',
  description: 'Show the bot uptime',
  cooldown: 15, //seconds(s)
  guarded: false, //or false
  permissions: [],
  clientPermissions: ["UseExternalEmojis"],
  examples: [''],

  async execute(client, message, args) {
    const ms = (await import('parse-ms')).default;

    let time = ms(client.uptime);
    var uptime = new discord.EmbedBuilder()
      .setColor(`DarkGreen`)
      .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true, size: 2048 }) })
      .setDescription(`<a:pp399:768864799625838604> **I have been online for \`${time.days}\` days, \`${time.hours}\` hours, \`${time.minutes}\` minutes, \`${time.seconds}\` seconds**`)
      .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
      .setTimestamp()
    message.channel.send({ embeds: [uptime] })
  }
}