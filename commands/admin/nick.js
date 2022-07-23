const discord = require('discord.js')

module.exports = {
  name: "nick",
  aliases: ["Nick", "NICK", "nickname"],
  dmOnly: false, //or false
  guildOnly: true, //or false
  args: true, //or false
  usage: '<user> <nickname>',
  group: 'Moderation',
  description: 'Changes the nickname of a member',
  cooldown: 2, //seconds(s)
  guarded: false, //or false
  permissions: ["MANAGE_NICKNAMES"],
  clientpermissions: ["MANAGE_NICKNAMES"],
  examples: [
    '@WOLF JoeMama',
    '742682490216644619 Unknown user!'
  ],
  async execute(client, message, [ member = '', ...args]) {

    const owner = await message.guild.fetchOwner()

    if (!member.match(/\d{17,19}/)){
      return message.channel.send(`\\❌ | ${message.author}, Please type the id or mention the user to change the nickname.`);
    };

    member = await message.guild.members
    .fetch(member.match(/\d{17,19}/)[0])
    .catch(() => null);

    let nickname = args.slice(1).join(" ")

    if (!args[1]) {
      return message.channel.send(`\\❌ | ${message.author}, Please type the nickname.`);
    }

    if (!member){
      return message.channel.send(`\\❌ | ${message.author}, User could not be found! Please ensure the supplied ID is valid.`);
    } else if (member.id === message.author.id){
      return message.channel.send(`\\❌ | ${message.author}, You cannot change nickname for yourself!`);
    } else if (member.id === client.user.id){
      return message.channel.send(`\\❌ | ${message.author}, You cannot change nickname me!`);
    } else if (member.id === message.guild.ownerId){
      return message.channel.send(`\\❌ | ${message.author}, You cannot change nickname for a server owner!`);
    } else if (client.owners.includes(member.id)){
      return message.channel.send(`\\❌ | ${message.author}, You can't change nickname for my developer through me!`);
    } else if (message.member.roles.highest.position < member.roles.highest.position){
      return message.channel.send(`\\❌ | ${message.author}, You can't change nickname for that user! He/She has a higher role than yours`);
    };

    return member.setNickname(nickname, `Wolfy Nickname: ${message.author.tag}`)
    .then(() => message.reply({ content: `\\✔️ Successfully changed **${member.user.tag}** nickname to \`${nickname}\`!`}))
    .catch(() => message.channel.send(`\\❌ | ${message.author}, Unable to change the nickname for **${member.user.tag}**!`));
}
}