const discord = require('discord.js');

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

      const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username === args.slice(0).join(" ") || x.user.username === args[0])

      const owner = client.users.fetch('724580315481243668').catch(() => null);
      if (user.id === owner){
        return message.channel.send({ content: `<a:Wrong:812104211361693696> | ${message.author}, No, you can't kick my developers through me!`})
      };


      if (user) {
  
        const member = message.guild.members.cache.get(user.id)
  
        if (member) {
  
          member

          // kick code 
            .kick({
                // the reason
              reason: 'They were bad!',
            })
            .then(() => {
            // it will send this message once the person is kicked
            const kick = new discord.MessageEmbed()
            .setTimestamp()
            .setAuthor(`${member.user.username}`, member.user.displayAvatarURL({dynamic: true, size: 2048}))
            .setDescription(`<:tag:813830683772059748> Successfully Kicked the user from the server\n<:pp833:853495153280155668> Kicked By: ${message.author.username}`);
            message.channel.send({ embeds: [kick] });
            })
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
           //////////////////////////////////////////////////////////////////////////////////////////////////////////
            .catch(err => {
              const Err = new discord.MessageEmbed()
              .setColor(`RED`)
              .setDescription(`<a:pp802:768864899543466006> I was unable to kick the member`)
              message.channel.send({ embeds: [Err] })
              console.error(err)
            })
        } else {
          const Err22 = new discord.MessageEmbed()
          .setColor(`RED`)
          .setDescription(`<a:pp802:768864899543466006> That user isn't in this guild!`)
          message.channel.send({ embeds: [Err22] })
        }
      }
  }
}