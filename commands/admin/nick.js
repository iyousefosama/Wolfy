const discord = require('discord.js')

/**
 * @type {import("../../util/types/baseCommand")}
 */
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
  permissions: ["ManageNicknames"],
  clientPermissions: ["ManageNicknames"],
  examples: [
    '@WOLF JoeMama',
    '742682490216644619 Unknown user!'
  ],
  
  async execute(client, message, [ member = '', ...args]) {

    if (!member.match(/\d{17,19}/)){
      return message.channel.send(`\\❌ | ${message.author}, Please type the id or mention the user to change the nickname.`);
    };

    member = await message.guild.members
    .fetch(member.match(/\d{17,19}/)[0])
    .catch(() => null);

    let nickname = args.slice(0).join(" ")

    if (!nickname) {
      return member.setNickname(null, `Wolfy Nickname: ${message.author.tag}`)
      .then(() => message.channel.send(`\\✔️ | ${message.author}, Successfully reseted the nickname for **${member.user.tag}**!`))
      .catch(() => message.channel.send(`\\❌ | ${message.author}, Unable to change the nickname for **${member.user.tag}**!`));
    }

    if (!member){
      return message.channel.send(`\\❌ | ${message.author}, User could not be found! Please ensure the supplied ID is valid.`);
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