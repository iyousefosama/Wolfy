const discord = require('discord.js')

module.exports = {
    name: "devmsg",
    aliases: ["Devmsg", "DEVMSG", "msg"],
    dmOnly: false, //or false
    guildOnly: false, //or false
    args: true, //or false
    usage: '<user> <message>',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    OwnerOnly: true,
    clientpermissions: ["EMBED_LINKS", "ATTACH_FILES"],
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
        .setAuthor({ name: message.author.username, iconURL: message.author.user.displayAvatarURL() })
  
          return message.channel.send({ embeds: [em] })
}

    let dm = args.slice(1).join(" ")
    if(!dm) return message.channel.send({ content: "I can't dm an empty message" })

    const dmembed = new discord.MessageEmbed()
      .setAuthor({ name: user.user.username, iconURL: user.user.displayAvatarURL({dynamic: true}) })
      .setTitle(`__Hey, ${user.user.username} you have a new message from bot developer__ <a:pp659:853495803967307887>`)
      .setURL('https://Wolfy.yoyojoe.repl.co')
      .setDescription(`${dm}`)
      .setTimestamp()
      .setImage(`https://cdn.discordapp.com/attachments/830926767728492565/874777015058858044/unnamed_2.png`)

    const err = new discord.MessageEmbed()
        .setColor(`RED`)
        .setDescription(`<a:pp802:768864899543466006> I can't send messages to ${user}`)

    try {
        await user.send({ embeds: [dmembed] })
    } catch (error) {
        return message.channel.send({ embeds: [err] })
    }
    let done = new discord.MessageEmbed()
    .setColor(`GREEN`)
    .setDescription(`<a:pp399:768864799625838604> Successfully DM the user ${user}`)
    message.channel.send({ embeds: [done] })
}
}