const discord = require('discord.js');
const cooldown = new Set();

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    if(cooldown.has(message.author.id)) {
      message.reply('Please wait \`5 seconds\` between using the command, because you are on cooldown')
    } else {

      if(!message.member.hasPermission("MANAGE_MESSAGES", "ADMINISTRATOR"))
      var Messingperms = new discord.MessageEmbed()
        .setColor(`RED`)
        .setDescription(`<a:pp802:768864899543466006> You don't have permission to use that command.`)
        message.channel.send(Messingperms)
      if(!message.member.hasPermission("MANAGE_MESSAGES", "ADMINISTRATOR")) return;
    if(!message.guild.me.permissions.has("ADMINISTRATOR")) return message.channel.send('<a:pp297:768866022081036319> Please Check My Permission <a:pp297:768866022081036319>')
     
        var user = message.mentions.users.first();
        var rn = args.slice(1).join(' ');
if(!user){ 
      let em = new discord.MessageEmbed()
      .setTitle('Error :')
      .setColor('RED')
      .setDescription(`
      **Usage:**
     ${prefix}dm (user) (message)
    
      **Ex :**
      ${prefix}dm ${message.author} 
      ${prefix}dm ${message.author} test
     
      `)
      .setAuthor(`${message.author.username}`, message.author.displayAvatarURL())

        return message.channel.send(em)
}
if(!rn){
      let op = new discord.MessageEmbed()
      .setTitle('Error :')
      .setColor('RED')
      .setDescription(`
      **Usage:**
     ${prefix}dm (user) (message)
    
      **Ex :**
      ${prefix}dm ${message.author} 
      ${prefix}dm ${message.author} test
     
      `)
      .setAuthor(`${message.author.username}`, message.author.displayAvatarURL())

        return message.channel.send(op)
}    
     let dm = new discord.MessageEmbed()
      .setColor('AQUA')
      .setTimestamp()
      .setFooter(message.guild.name, message.guild.iconURL())
      .setDescription(`
      <a:Notification:811283631380234250> **${message.author.username}** : ${rn}
      `)
      .setAuthor(`${message.author.username}`, message.author.displayAvatarURL())
      user.send(dm).then(() => {
          let done = new discord.MessageEmbed()
          .setColor(`GREEN`)
          .setDescription(`<a:pp399:768864799625838604> Done Sended the msg for ${user}`)
          message.channel.send(done)
          }).catch(() => { 
            let err = new discord.MessageEmbed()
          .setColor(`RED`)
          .setDescription(`<a:pp802:768864899543466006> I can't send messages to ${user}`)
          message.channel.send(err)
          })
      }
        cooldown.add(message.author.id);
        setTimeout(() => {
            cooldown.delete(message.author.id)
        }, 5000); // here will be the time in miliseconds 5 seconds = 5000 miliseconds
}


module.exports.help = {
    name: "dm",
    aliases: ['Dm']
}