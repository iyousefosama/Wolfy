const discord = require('discord.js');

module.exports = {
  name: "ban",
  aliases: ["Ban", "BAN"],
  dmOnly: false, //or false
  guildOnly: true, //or false
  args: true, //or false
  usage: '<user> <reason>',
  cooldown: 1, //seconds(s)
  guarded: false, //or false
  permissions: ["BAN_MEMBERS", "ADMINISTRATOR"],
  clientpermissions: ["BAN_MEMBERS", "ADMINISTRATOR"],
  async execute(client, message, args) {
  
      const owner = client.users.fetch('724580315481243668').catch(() => null);
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
     .setDescription('<a:pp802:768864899543466006> User could not be banned!')
     .setColor('RED')
 ///////////////////////////////////////////////// Errors /////////////////////////////////////////////////
     if (!user) return message.reply({ embeds: [Err1] })
     if (user.id === client.user.id) return message.reply({ embeds: [Err2] })
     if (user.id === message.author.id) return message.reply({ embeds: [Err3] })
     if (message.member.roles.highest.position <= user.roles.highest.position) return message.reply({ embeds: [Err4] })
     if (user.id === owner){
      return message.reply({ content: `<a:Wrong:812104211361693696> | ${message.author} No, you can't ban my developers through me!`})
    };
 //////////////////////////////////////////////////////////////////////////////////////////////////////////
  
      if (user) {
  
        const member = message.guild.members.cache.get(user.id);
  
        if (member) {
  
          member
            .ban({
              reason: `${reason}`,
            })
            .then(() => {
            const ban = new discord.MessageEmbed()
            .setTimestamp()
            .setAuthor(`${member.user.username}`, member.user.displayAvatarURL({dynamic: true, size: 2048}))
            .setDescription(`<:tag:813830683772059748> Successfully Banned the user from the server\n<:pp833:853495153280155668> Banned By: ${message.author.username}\n<:Rules:840126839938482217> Reason: ${reason}`);
            message.channel.send({ embeds: [ban] });
            })
            .catch(err => {
              const Err = new discord.MessageEmbed()
              .setColor(`RED`)
              .setDescription(`<a:pp802:768864899543466006> I was unable to ban the member`)
              message.channel.send({ embeds: [Err] })
              console.error(err);
            });
        } else {
          const Err22 = new discord.MessageEmbed()
          .setColor(`RED`)
          .setDescription(`<a:pp802:768864899543466006> That user isn't in this guild!`)
          message.channel.send({ embeds: [Err22] })
        }
      }
  }
}