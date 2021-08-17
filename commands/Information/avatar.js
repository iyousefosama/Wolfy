const discord = require('discord.js');
const { MessageEmbed } = require('discord.js')

module.exports = {
  name: "avatar",
  aliases: ["Avatar", "AVATAR"],
  dmOnly: false, //or false
  guildOnly: true, //or false
  args: false, //or false
  usage: '<user>',
  cooldown: 1, //seconds(s)
  guarded: false, //or false
  clientpermissions: ["EMBED_LINKS", "ATTACH_FILES"],
  async execute(client, message, args) {
    const avatar = message.mentions.users.first()
    const embed = new MessageEmbed()
    .setAuthor(message.member.displayName, message.member.user.displayAvatarURL())
    .setColor('RANDOM')
    .setTitle(`Avatar Link!`)
    .setURL(message.member.user.displayAvatarURL({dynamic: true, format: 'png', size: 512}))
    .setImage(message.author.displayAvatarURL({dynamic: true, format: 'png', size: 512}))
    .setTimestamp()
      if(!avatar) return message.channel.send(embed) 
      else if(avatar) {
      const embed2 = new MessageEmbed()
        .setAuthor(message.member.displayName, message.member.user.displayAvatarURL())
        .setColor('RANDOM')
        .setTitle(`Avatar Link!`)
        .setURL(avatar.displayAvatarURL({dynamic: true, format: 'png', size: 512}))
        .setImage(avatar.displayAvatarURL({dynamic: true, format: 'png', size: 512}))
        .setFooter(`Requested By: ${message.member.displayName}`)
        .setTimestamp() 
      message.channel.send(embed2)
    }
  }
}