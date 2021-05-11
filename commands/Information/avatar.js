const discord = require('discord.js');
const { MessageEmbed } = require('discord.js')

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    const avatar = message.mentions.users.first()
    const embed = new MessageEmbed()
    .setAuthor(message.member.displayName, message.member.user.displayAvatarURL())
    .setColor('RANDOM')
    .setTitle(`Avatar Link!`)
    .setURL(message.member.user.displayAvatarURL())
    .setImage(message.author.displayAvatarURL({dynamic: true, format: 'png', size: 512}))
    .setFooter(`Requested By: ${message.member.displayName}`)
    .setTimestamp()
      if(!avatar) return message.channel.send(embed) 
      else if(avatar) {
      const embed2 = new MessageEmbed()
        .setAuthor(message.member.displayName, message.member.user.displayAvatarURL())
        .setColor('RANDOM')
        .setTitle(`Avatar Link!`)
        .setURL(message.member.user.displayAvatarURL())
        .setImage(avatar.displayAvatarURL({dynamic: true, format: 'png', size: 512}))
        .setFooter(`Requested By: ${message.member.displayName}`)
        .setTimestamp() 
      message.channel.send(embed2)
    }

}

    

module.exports.help = {
    name: "avatar",
    aliases: ['Avatar']
}