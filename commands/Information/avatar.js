const discord = require('discord.js')
const { EmbedBuilder } = require('discord.js')
const https = require('https');

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
  name: "avatar",
  aliases: [],
  dmOnly: false, //or false
  guildOnly: false, //or false
  args: false, //or false
  usage: '<user>',
  group: 'Informations',
  description: 'Get a user\'s avatar.',
  cooldown: 1, //seconds(s)
  guarded: false, //or false
  permissions: [],
  clientPermissions: ["EmbedLinks", "AttachFiles"],
  examples: [
    '@WOLF',
    '724580315481243668',
    ''
  ],
  
  async execute(client, message, [user = '']) {
    let color;

    if (message.guild){
      const id = (user.match(/\d{17,19}/)||[])[0] || message.author.id;

      member = await message.guild.members.fetch(id)
      .catch(() => message.member);

      color = member.displayColor || '738ADB';
      user = member.user;
    } else {
      color = '738ADB';
      user = message.author;
    };

    let avatar = user.displayAvatarURL({ dynamic: true, size: 1024, extension: 'gif' });
    https
    .request(avatar, { method: 'HEAD' }, (response) => {
      if (response.statusCode !== 200) {
        avatar = user.displayAvatarURL({ dynamic: true, size: 1024, extension: 'png' || 'jpg' });
      } else if (response.headers['content-type'].startsWith('image/')) {
        // Do nothing here...
      } else {
        avatar = user.displayAvatarURL({ dynamic: true, size: 1024, extension: 'jpg' || 'png' });
      }

      if(!avatar) return message.channel.send({ content: `\\❌ | ${message.author}, I can't find an avatar for this user!`})
  
      const embed = new EmbedBuilder()
      .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .setColor(color)
      .setDescription(`[**${user.tag}** avatar link](${avatar})`)
      .setURL(avatar)
      .setImage(avatar)
      .setFooter({ text: user.username + `\'s avatar | \©️${new Date().getFullYear()} Wolfy`, iconURL: message.guild.iconURL({dynamic: true}) })
      .setTimestamp()
      message.channel.send({ embeds: [embed]})
    })
    .on('error', (error) => {
      console.error(error);
      return message.channel.send({ content: `\\❌ | ${message.author}, Something went wrong, please try again later!`})
    })
    .end()
  }
}