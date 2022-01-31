const discord = require('discord.js')

module.exports = {
    name: "dm",
    aliases: ["Dm", "DM"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<user> <message>',
    group: 'Moderation',
    description: 'Dms someone in the server with message',
    cooldown: 10, //seconds(s)
    guarded: false, //or false
    permissions: ["ADMINISTRATOR"],
    examples: [
        '@WOLF Hello, how are you today ?',
        '742682490216644619 We started a giveaway for your birthday come!'
      ],
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
        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({dynamic: true, size: 2048})})
  
          return message.channel.send({ embeds: [em] })
}

    let dm = args.slice(1).join(" ")
    if(!dm) return message.reply({ content: "I can't dm an \`empty message\`!"}).then(()=>  message.react("💢")).catch(() => null)

    const dmembed = new discord.MessageEmbed()
      .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({dynamic: true, size: 2048})})
      .setColor('AQUA')
      .setDescription(`<a:Notification:811283631380234250> **${message.author.username}**: ${dm}`)
      .setTimestamp()
      .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({dynamic: true}) });

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