const discord = require('discord.js')

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
    name: "dm",
    aliases: ["send"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<user> <message>',
    group: 'Moderation',
    description: 'Dms someone in the server with message',
    cooldown: 10, //seconds(s)
    guarded: false, //or false
    permissions: ["Administrator"],
    examples: [
        '@WOLF Hello, how are you today ?',
        '742682490216644619 We have started a giveaway for your birthday!'
      ],

  async execute(client, message, args) {

    let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username === args.slice(0).join(" ") || x.user.username === args[0])

    let dm = args.slice(1).join(" ")
    if(!dm) return message.reply({ content: "I can't dm an \`empty message\`!"}).then(()=>  message.react("💢")).catch(() => null)

    const dmembed = new discord.EmbedBuilder()
      .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({dynamic: true, size: 2048})})
      .setColor('Aqua')
      .setDescription(`<a:Notification:811283631380234250> **${message.author.username}**: ${dm}`)
      .setTimestamp()
      .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({dynamic: true}) })

    return await user.send({ embeds: [dmembed] }).then(() => {
        let done = new discord.EmbedBuilder()
        .setColor(`Green`)
        .setDescription(`<a:pp399:768864799625838604> Successfully DM the user ${user}`)
        message.channel.send({ embeds: [done] })
    }).catch(() => message.channel.send({ embeds: [new discord.EmbedBuilder()
        .setColor(`Red`)
        .setDescription(`<a:pp802:768864899543466006> I can't send messages to ${user}`)] }))
}
}