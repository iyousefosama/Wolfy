const discord = require('discord.js');
const config = require('../../config.json')

module.exports = {
  name: "softban",
  aliases: ["SoftBan", "SOFTBAN"],
  dmOnly: false, //or false
  guildOnly: true, //or false
  args: true, //or false
  usage: '<user> <reason>',
  group: 'Moderation',
  description: 'Kicks a user and deletes all their messages in the past 7 days',
  cooldown: 1, //seconds(s)
  guarded: false, //or false
  permissions: ["BAN_MEMBERS"],
  clientpermissions: ["BAN_MEMBERS"],
  examples: [
    '@BADGUY',
    '742682490216644619'
  ],
  async execute(client, message, [ member = '', ...args]) {

    const owner = await message.guild.fetchOwner()

    let reason = args.slice(0).join(" ")
    if (!args[0]) reason = 'No reason specified'

    if (!member.match(/\d{17,19}/)){
      return message.channel.send(`\\❌ | ${message.author}, Please type the id or mention the user to softban.`);
    };

    member = await message.guild.members
    .fetch(member.match(/\d{17,19}/)[0])
    .catch(() => null);

    if (!member){
      return message.channel.send(`\\❌ | ${message.author}, User could not be found! Please ensure the supplied ID is valid.`);
    } else if (member.id === message.author.id){
      return message.channel.send(`\\❌ | ${message.author}, You cannot softban yourself!`);
    } else if (member.id === client.user.id){
      return message.channel.send(`\\❌ | ${message.author}, You cannot softban me!`);
    } else if (member.id === message.guild.ownerId){
      return message.channel.send(`\\❌ | ${message.author}, You cannot softban a server owner!`);
    } else if (config.developer.includes(member.id)){
      return message.channel.send(`\\❌ | ${message.author}, You can't softban my developer through me!`);
    } else if (message.member.roles.highest.position < member.roles.highest.position){
      return message.channel.send(`\\❌ | ${message.author}, You can't softban that user! He/She has a higher role than yours`);
    } else if (!member.bannable){
      return message.channel.send(`\\❌ | ${message.author}, I couldn't softban that user!`)
    };

    const timestamp = Math.floor(Date.now() / 1000)
    const softban = new discord.MessageEmbed()
    .setTimestamp()
    .setAuthor(member.user.tag, member.user.displayAvatarURL({dynamic: true, size: 2048}))
    .setDescription(`<:tag:813830683772059748> Successfully Softbanned the user from the server\n\n<a:pp989:853496185443319809> • **Moderator:** ${message.author.username} (${message.author.id})\n<:Rules:840126839938482217> • **Reason:** \`${reason}\`\n<a:Right:877975111846731847> • **At:** <t:${timestamp}>`);

    return message.guild.members.ban(member, { reason:  `Wolfy SOFTBANS: ${message.author.tag}`, days: 7 })
    .then(() => message.guild.members.unban(member, { reason: `Wolfy SOFTBANS: ${message.author.tag}` }))
    .then(() => message.channel.send({ embeds: [softban]}))
    .catch(() => message.channel.send(`\\❌ | ${message.author}, Unable to softban **${member.user.tag}**!`));
  }
}