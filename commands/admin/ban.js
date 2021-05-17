const discord = require('discord.js');

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    if (message.channel.type === "dm") return;
    const Messingperms = new discord.MessageEmbed()
    .setColor(`RED`)
    .setDescription(`<a:pp802:768864899543466006> You don't have permission to use that command.`)
    if(!message.member.hasPermission('BAN_MEMBERS', 'ADMINISTRATOR')) return message.channel.send(Messingperms)
    if(!message.guild.me.permissions.has('BAN_MEMBERS', 'ADMINISTRATOR')) return;

     /////////////////////////////////////////////// Errors /////////////////////////////////////////////
        const Err1 = new discord.MessageEmbed()
        .setTitle('Muting Error!')
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
        .setDescription('<a:pp802:768864899543466006> User could not be baned!')
        .setColor('RED')
    ///////////////////////////////////////////////// Errors /////////////////////////////////////////////////
        if (!user) return message.reply(Err1)
        if (user.id === Client.user.id) return message.reply(Err2)
        if (user.id === message.author.id) return message.reply(Err3)
        if (message.user.roles.highest.position <= member.roles.highest.position) return message.reply(Err4)
    //////////////////////////////////////////////////////////////////////////////////////////////////////////

    else {
      if (!message.guild) return;
  
      const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
      let reason = args.slice(1).join(" ")
  
      if (user) {
  
        const member = message.guild.member(user);
  
        if (member) {
  
          member
          // banning code 
            .ban({
                // the reason
              reason: `${reason}`,
            })
            .then(() => {
            // it will send this message once the person is banned
            const ban = new discord.MessageEmbed()
            .setTimestamp()
            .setThumbnail(member.user.displayAvatarURL())
            .setAuthor('Successfully banned the user from the server')
            .setDescription(`User: ${member}\nBanned by: \`${message.author.username}\`\nReason: ${reason}`);
            message.channel.send(ban);
            })
            // log err in the console
            .catch(err => {
              // if the bot wasnt able to ban the member bcz he hv a higher role it will not ban him and if the bot dont hv to perm it will not ban him and send this messge
              message.reply('I was unable to ban the member');

              console.error(err);
            });
        } else {
          // if the member isnt in the server and u typed e.g. =ban @karimx it will send this message
          message.reply("That user isn't in this guild!");
        }
      } else {
       // if u typed =ban without mentioning some1 it will send this message
        message.reply("You didn't mention the user to ban!");
      }
  };
}

module.exports.help = {
    name: "ban",
    aliases: ["Ban"]
};