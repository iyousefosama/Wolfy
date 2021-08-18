const discord = require('discord.js')
const cooldown = new Set();

module.exports = {
    name: "dm",
    aliases: ["Dm", "DM"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<user> <message>',
    cooldown: 10, //seconds(s)
    guarded: false, //or false
    permissions: ["ADMINISTRATOR"],
    clientpermissions: ["ADMINISTRATOR"],
    async execute(client, message, args) {

    let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username === args.slice(0).join(" ") || x.user.username === args[0])

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
        .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({dynamic: true, size: 2048}))
  
          return message.channel.send(em)
}

    let dm = args.slice(1).join(" ")
    if(!dm) return message.channel.send("I can't dm an empty message")

    const dmembed = new discord.MessageEmbed()
      .setColor('AQUA')
      .setTimestamp()
      .setFooter(message.guild.name, message.guild.iconURL({dynamic: true}))
      .setDescription(`
      <a:Notification:811283631380234250> **${message.author.username}**: ${dm}
      `)
      .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({dynamic: true}))

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
    cooldown.add(message.author.id);
    setTimeout(() => {
        cooldown.delete(message.author.id)
    }, 5000); // here will be the time in miliseconds 5 seconds = 5000 miliseconds
}
}