const discord = require('discord.js');
const { MessageEmbed } = require('discord.js')

module.exports = {
  name: "avatar",
  aliases: ["Avatar", "AVATAR"],
  dmOnly: false, //or false
  guildOnly: true, //or false
  args: false, //or false
  usage: '<user>',
  group: 'Informations',
  description: 'Get a user\'s avatar.',
  cooldown: 1, //seconds(s)
  guarded: false, //or false
  permissions: [],
  clientpermissions: ["EMBED_LINKS", "ATTACH_FILES"],
  examples: [
    '@WOLF',
    '724580315481243668',
    ''
  ],
  async execute(client, message, args) {
    const avatar = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username === args.slice(0).join(" ") || x.user.username === args[0])
    const embed = new MessageEmbed()
    .setAuthor(message.member.displayName, message.member.user.displayAvatarURL())
    .setColor(message.member.displayColor || '738ADB')
    .setTitle(`Avatar Link!`)
    .setURL(message.member.user.displayAvatarURL({dynamic: true, format: 'png', size: 512}))
    .setImage(message.author.displayAvatarURL({dynamic: true, format: 'png', size: 512}))
    .setTimestamp()
      if(!avatar) return message.channel.send({ embeds: [embed] }) 
      else if(avatar) {
      const embed2 = new MessageEmbed()
        .setAuthor(message.member.displayName, message.member.user.displayAvatarURL())
        .setColor(avatar.displayColor || '738ADB')
        .setTitle(`Avatar Link!`)
        .setURL(avatar.user.displayAvatarURL({dynamic: true, format: 'png', size: 512}))
        .setImage(avatar.user.displayAvatarURL({dynamic: true, format: 'png', size: 512}))
        .setTimestamp() 
      message.channel.send({ embeds: [embed2] })
    }
  }
}