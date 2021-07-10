const discord = require('discord.js')

module.exports.run = async (Client, message, args, prefix) => {
  if(!message.content.startsWith(`w@`)) return;
  if(message.author.id !== '829819269806030879') return
    if (message.channel.type === "dm") return;
    if(!message.guild.me.permissions.has('ADMINISTRATOR')) return message.channel.send('<a:pp297:768866022081036319> Please Check My Permission <a:pp297:768866022081036319>')

    let user = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
    if(!user) return message.reply("**Please mention a User to change his nickname!**")

    let nickname = args.slice(1).join(" ") // =nickname (user) (nickname kdjv)
    if(!nickname) return message.reply("**Please specify a nickname!**")

    let member = message.guild.members.cache.get(user.id);
    await member.setNickname(nickname);

    const embed = new discord.MessageEmbed()
    .setDescription(`<a:Right:812104211386728498> Successfully changed ${user.tag}'s nickname to ${nickname}`)
    .setColor('DARK_GREEN')
    .setTimestamp()
    message.channel.send(embed)
}

module.exports.help = {
    name: 'nick',
    aliases: ['nickname', 'Nick', 'setnick']
}