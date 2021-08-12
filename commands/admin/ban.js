const discord = require('discord.js');

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    if (message.channel.type === "dm") return;
    const Messingperms = new discord.MessageEmbed()
    .setColor(`RED`)
    .setDescription(`<a:pp802:768864899543466006> You don't have permission to use that command.`)
    if(!message.member.hasPermission('BAN_MEMBERS', 'ADMINISTRATOR')) return message.channel.send(Messingperms)
    if(!message.guild.me.permissions.has('BAN_MEMBERS', 'ADMINISTRATOR')) return;

    else {
      if (!message.guild) return;
  
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
     .setDescription('<a:pp802:768864899543466006> User could not be muted!')
     .setColor('RED')
 ///////////////////////////////////////////////// Errors /////////////////////////////////////////////////
     if (!user) return message.reply(Err1)
     if (user.id === Client.user.id) return message.reply(Err2)
     if (user.id === message.author.id) return message.reply(Err3)
     if (user.roles.highest.position <= member.roles.highest.position) return message.reply(Err4)
 //////////////////////////////////////////////////////////////////////////////////////////////////////////
  
      if (user) {
  
        const member = message.guild.member(user);
  
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
            message.channel.send(ban);
            })
            .catch(err => {
              const Err = new discord.MessageEmbed()
              .setColor(`RED`)
              .setDescription(`<a:pp802:768864899543466006> I was unable to ban the member`)
              message.channel.send(Err)
              console.error(err);
            });
        } else {
          const Err2 = new discord.MessageEmbed()
          .setColor(`RED`)
          .setDescription(`<a:pp802:768864899543466006> That user isn't in this guild!`)
          message.channel.send(Err2)
        }
      }
  };
}

module.exports.help = {
    name: "ban",
    aliases: ["Ban"]
};