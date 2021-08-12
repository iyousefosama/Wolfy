const discord = require('discord.js');

module.exports.run = async (Client, message, args, prefix) => {
  if(!message.content.startsWith(prefix)) return
  if (message.channel.type === "dm") return;
    const Messingperms = new discord.MessageEmbed()
    .setColor(`RED`)
    .setDescription(`<a:pp802:768864899543466006> You don't have permission to use that command.`)
    if(!message.member.hasPermission('KICK_MEMBERS', 'ADMINISTRATOR')) return message.channel.send(Messingperms)
    if(!message.guild.me.permissions.has('KICK_MEMBERS', 'ADMINISTRATOR')) return;
    else {
      if (!message.guild) return;
  
      const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username === args.slice(0).join(" ") || x.user.username === args[0])
  
      if (user) {
  
        const member = message.guild.member(user);
  
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
            message.channel.send(kick);
            })
            // log err in the console
            .catch(err => {
              // if the bot wasnt able to kick the member bcz he hv a higher role it will not kick him and if the bot dont hv to perm it will not kick him and send this messge
              const Err = new discord.MessageEmbed()
              .setColor(`RED`)
              .setDescription(`<a:pp802:768864899543466006> I was unable to kick the member`)
              message.channel.send(Err)
              console.error(err);
            });
        } else {
          // if the member isnt in the server and u typed e.g. =kick @karimx it will send this message
          const Err2 = new discord.MessageEmbed()
          .setColor(`RED`)
          .setDescription(`<a:pp802:768864899543466006> That user isn't in this guild!`)
          message.channel.send(Err2)
        }
      } else {
       // if u typed =kick without mentioning some1 it will send this message
        const Err3 = new discord.MessageEmbed()
        .setColor(`RED`)
        .setDescription(`<a:pp802:768864899543466006> You didn't mention the user to kick!`)
        message.channel.send(Err3)
      }
  };
}

module.exports.help = {
    name: "kick",
    aliases: ['Kick']
};