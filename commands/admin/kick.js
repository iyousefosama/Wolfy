const discord = require('discord.js');
const config = require('../../config.json')

module.exports = {
  name: "kick",
  aliases: ["Kick", "KICK"],
  dmOnly: false, //or false
  guildOnly: true, //or false
  args: true, //or false
  usage: '<member>',
  group: 'Moderation',
  description: 'Kick a member from the server',
  cooldown: 1, //seconds(s)
  guarded: false, //or false
  permissions: ["KICK_MEMBERS", "ADMINISTRATOR"],
  clientpermissions: ["KICK_MEMBERS", "ADMINISTRATOR"],
  examples: [
    '@BADGUY',
    '742682490216644619'
  ],
  async execute(client, message, args) {

      const owner = await message.guild.fetchOwner()
      const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username === args.slice(0).join(" ") || x.user.username === args[0])

      let reason = args.slice(1).join(" ")
      if (!args[1]) reason = 'No reason specified'

               /////////////////////////////////////////////// Errors /////////////////////////////////////////////
               const Err1 = new discord.MessageEmbed()
               .setTitle('Error!')
               .setDescription('<a:pp802:768864899543466006> Please mention a user!')
               .setColor('RED')
               const Err2 = new discord.MessageEmbed()
               .setTitle('Error!')
               .setDescription('<a:pp802:768864899543466006> You can\'t ban me!')
               .setColor('RED')
               const Err3 = new discord.MessageEmbed()
               .setTitle('Error!')
               .setDescription('<a:pp802:768864899543466006> You can\'t ban yourself!')
               .setColor('RED')
               const Err4 = new discord.MessageEmbed()
               .setTitle('Error!')
               .setDescription('<a:pp802:768864899543466006> User could not be kicked!')
               .setColor('RED')
           ///////////////////////////////////////////////// Errors /////////////////////////////////////////////////
               if (!user) return message.reply({ embeds: [Err1] })
               if (user.id === client.user.id) return message.reply({ embeds: [Err2] })
               if (user.id === message.author.id) return message.reply({ embeds: [Err3] })
               if (message.member.roles.highest.position <= user.roles.highest.position) return message.reply({ embeds: [Err4] })
               if (user.id === config.developer){
                return message.channel.send({ content: `<a:Wrong:812104211361693696> | ${message.author}, You can't kick my developers through me!`})
              };
              if (member.id === message.guild.ownerId){
                return message.channel.send(`\\❌ | ${message.author}, You cannot kick a server owner!`)
              }
           //////////////////////////////////////////////////////////////////////////////////////////////////////////
           
      if (user) {
  
        const member = message.guild.members.cache.get(user.id)
  
        if (member) {
  
          member

          // kick code 
            .kick({
                // the reason
              reason: `Wolfy kick Command: ${message.author.tag}: ${reason}`,
            })
            .then(() => {
            const timestamp = Math.floor(Date.now() / 1000)
            const kick = new discord.MessageEmbed()
            .setTimestamp()
            .setAuthor(`${member.user.username}`, member.user.displayAvatarURL({dynamic: true, size: 2048}))
            .setDescription(`<:tag:813830683772059748> Successfully Kicked the user from the server\n\n<:pp833:853495153280155668> • **Moderator:** ${message.author.username} (${message.author.id})\n<:Rules:840126839938482217> • **Reason:** \`${reason}\`\n<a:Right:877975111846731847> • **At:** <t:${timestamp}>`);
            message.channel.send({ embeds: [kick] });
            })
            .catch(err => {
              const Err = new discord.MessageEmbed()
              .setColor(`RED`)
              .setDescription(`<a:pp802:768864899543466006> I was unable to kick the member`)
              message.channel.send({ embeds: [Err] })
            })
        } else {
          const Err22 = new discord.MessageEmbed()
          .setColor(`RED`)
          .setDescription(`<a:pp802:768864899543466006> Failed to kick **${user.username}**!`)
          message.channel.send({ embeds: [Err22] })
        }
      }
  }
}