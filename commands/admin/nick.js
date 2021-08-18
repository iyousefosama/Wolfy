const discord = require('discord.js')

module.exports = {
  name: "nike",
  aliases: ["Nike", "NIKE"],
  dmOnly: false, //or false
  guildOnly: true, //or false
  args: true, //or false
  usage: '<user> <nickname>',
  cooldown: 2, //seconds(s)
  guarded: false, //or false
  permissions: ["MANAGE_NICKNAMES", "ADMINISTRATOR"],
  clientpermissions: ["MANAGE_NICKNAMES", "ADMINISTRATOR"],
  async execute(client, message, args) {

    let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username === args.slice(0).join(" ") || x.user.username === args[0])
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
    .catch(err => {
      const UnknownErr = new discord.MessageEmbed()
      .setColor(`RED`)
      .setDescription(`<a:pp802:768864899543466006> Error, please report this to on our support server!`)
      .setURL(`https://discord.gg/qYjus2rujb`)
      message.channel.send(UnknownErr)
      console.error(err);
    })
}
}