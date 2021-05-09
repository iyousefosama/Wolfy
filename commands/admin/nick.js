const discord = require('discord.js')

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return
    // the perm. that the member need it to ban someone
    if(!message.member.hasPermission('ADMINISTRATOR'))
    // if someone dont hv perm it will send this message
    var Messingperms = new discord.MessageEmbed()
      .setColor(`RED`)
      .setDescription(`<a:pp802:768864899543466006> You don't have permission to use that command.`)
      message.channel.send(Messingperms)
      if(!message.member.hasPermission('ADMINISTRATOR')) return;
    if(!message.guild.me.permissions.has('ADMINISTRATOR')) return message.channel.send('<a:pp297:768866022081036319> Please Check My Permission <a:pp297:768866022081036319>')

    let user = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
    if(!user) return message.reply("**Please mention a User to change his nickname!**")

    let nickname = args.slice(1).join(" ") // =nickname (user) (nickname kdjv)
    if(!nickname) return message.reply("**Please specify a nickname!**")

    let member = message.guild.members.cache.get(user.id);
    await member.setNickname(nickname);

    const embed = new discord.MessageEmbed()
    .setDescription(`<a:Right:812104211386728498> Successfully changed ${user.tag}'s nickname to ${nickname}`)
    .setColor('RANDOM')
    .setTimestamp()
    message.channel.send(embed)
}

module.exports.help = {
    name: 'nick',
    aliases: ['nickname', 'Nick', 'setnick']
}