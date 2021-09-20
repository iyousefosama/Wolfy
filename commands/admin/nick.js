const discord = require('discord.js')

module.exports = {
  name: "nick",
  aliases: ["Nick", "NICK"],
  dmOnly: false, //or false
  guildOnly: true, //or false
  args: true, //or false
  usage: '<user> <nickname>',
  group: 'Moderation',
  description: 'Changes the nickname of a member',
  cooldown: 2, //seconds(s)
  guarded: false, //or false
  permissions: ["MANAGE_NICKNAMES", "ADMINISTRATOR"],
  clientpermissions: ["MANAGE_NICKNAMES", "ADMINISTRATOR"],
  examples: [
    '@WOLF JoeMama',
    '742682490216644619 Unknown user!'
  ],
  async execute(client, message, args) {

    let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username === args.slice(0).join(" ") || x.user.username === args[0])
    if(!user) return message.reply({ content: "**Please mention a User to change his nickname!**"})

    let nickname = args.slice(1).join(" ")
    if(!nickname) return message.reply({ content: "Please specify a nickname!"})

    const Err4 = new discord.MessageEmbed()
    .setTitle('Error!')
    .setDescription('<a:pp802:768864899543466006> I can\'t change \`nickname\` for this user!')
    .setColor('RED')
    if(user.roles.highest.position <= user.roles.highest.position) return message.reply({ embeds: [Err4] })

    let member = message.guild.members.cache.get(user.id);
    await member.setNickname(nickname);

    const embed = new discord.MessageEmbed()
    .setDescription(`<a:Right:812104211386728498> Successfully changed ${user.tag}'s nickname to ${nickname}`)
    .setColor('DARK_GREEN')
    .setTimestamp()
    message.channel.send({ embeds: [embed] })
    .catch(err => {
      const UnknownErr = new discord.MessageEmbed()
      .setColor(`RED`)
      .setDescription(`<a:pp802:768864899543466006> Error, please report this with \`w!feedback\`!`)
      message.channel.send({ embeds: [UnknownErr] })
      console.error(err);
    })
}
}