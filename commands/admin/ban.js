const discord= require('discord.js');

module.exports = {
  name: "ban",
  aliases: ["Ban", "BAN"],
  dmOnly: false, //or false
  guildOnly: true, //or false
  args: true, //or false
  usage: '<user> <reason>',
  group: 'Moderation',
  description: 'Bans a member from the server',
  cooldown: 1, //seconds(s)
  guarded: false, //or false
  permissions: ["BAN_MEMBERS"],
  clientpermissions: ["BAN_MEMBERS"],
  examples: [
    '@BADGUY Toxic member',
    '742682490216644619'
  ],
  async execute(client, message, [ member = '', ...args]) {

    const owner = await message.guild.fetchOwner()

    let reason = args.slice(0).join(" ")

    if (!member.match(/\d{17,19}/)){
      return message.channel.send(`\\❌ | ${message.author}, Please type the id or mention the user to ban.`);
    };

    member = await message.guild.members
    .fetch(member.match(/\d{17,19}/)[0])
    .catch(() => null);

    if (!member){
      return message.channel.send(`\\❌ | ${message.author}, User could not be found! Please ensure the supplied ID is valid.`);
    } else if (member.id === message.author.id){
      return message.channel.send(`\\❌ | ${message.author}, You cannot ban yourself!`);
    } else if (member.id === client.user.id){
      return message.channel.send(`\\❌ | ${message.author}, You cannot ban me!`);
    } else if (member.id === message.guild.ownerId){
      return message.channel.send(`\\❌ | ${message.author}, You cannot ban a server owner!`);
    } else if (client.owners.includes(member.id)){
      return message.channel.send(`\\❌ | ${message.author}, You can't ban my developer through me!`);
    } else if (message.member.roles.highest.position < member.roles.highest.position){
      return message.channel.send(`\\❌ | ${message.author}, You can't ban that user! He/She has a higher role than yours`);
    } else if (!member.bannable){
      return message.channel.send(`\\❌ | ${message.author}, I couldn't ban that user!`)
    };

    const ban = new discord.EmbedBuilder()
    .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({dynamic: true, size: 2048})})
    .setDescription([ `<:tag:813830683772059748> Successfully Banned the user from the server`, !args[0] ? '' :
    ` for reason: \`${reason || 'Unspecified'}\`` ].join(''))
    .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL({dynamic: true, size: 2048})})
    .setTimestamp()

    return message.guild.members.ban(member, { reason:  `Wolfy BAN: ${message.author.tag}: ${reason || 'Unspecified'}` })
    .then(() => message.channel.send({ embeds: [ban]}))
    .catch(() => message.channel.send(`\\❌ | ${message.author}, Unable to ban **${member.user.tag}**!`));
  }
}