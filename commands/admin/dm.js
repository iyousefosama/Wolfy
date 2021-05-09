const discord = require('discord.js')

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return
    const Messingperms = new discord.MessageEmbed()
    .setColor(`RED`)
    .setDescription(`<a:pp802:768864899543466006> You don't have permission to use that command.`)
    if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(Messingperms)
    if(!message.guild.me.permissions.has('ADMINISTRATOR')) return;
    let user = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
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

    let dm = args.slice(1).join(" ")
    if(!dm) return message.channel.send("I can't dm an empty message")

    const dmembed = new discord.MessageEmbed()
      .setColor('AQUA')
      .setTimestamp()
      .setFooter(message.guild.name, message.guild.iconURL())
      .setDescription(`
      <a:Notification:811283631380234250> **${message.author.username}** : ${dm}
      `)
      .setAuthor(`${message.author.username}`, message.author.displayAvatarURL())

    const err = new discord.MessageEmbed()
        .setColor(`RED`)
        .setDescription(`<a:pp802:768864899543466006> I can't send messages to ${user}`)

    try {
        await user.send(dmembed)
    } catch (error) {
        return message.channel.send(err)
    }
    let done = new discord.MessageEmbed()
    .setColor(`GREEN`)
    .setDescription(`<a:pp399:768864799625838604> Successfully DM the user ${user}`)
    message.channel.send(done)

}

module.exports.help = {
    name: 'dm',
    aliases: ['Dm']
}