const discord = require('discord.js')

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
  name: "hackban",
  aliases: ["HackBan", "HACKBAN"],
  dmOnly: false, //or false
  guildOnly: true, //or false
  args: true, //or false
  usage: '<user> <reason>',
  group: 'Moderation',
  description: 'Bans a member not in the server',
  cooldown: 1, //seconds(s)
  guarded: false, //or false
  permissions: ["BanMembers"],
  clientPermissions: ["BanMembers"],
  examples: [
    '742682490216644619 Big scammer!'
  ],
  /**
*
* @param {import("discord.js").Client} client
* @param {import("discord.js").Message} message
* @param {String[]} args
*
*/
  async execute(client, message, [user = '', ...reason]) {

    const owner = await message.guild.fetchOwner()

    if (!user.match(/\d{17,19}/)) {
      return message.channel.send({ content: `<a:Wrong:812104211361693696> | ${message.author}, Please provide the ID of the user to ban.` });
    };

    user = await client.users
      .fetch(user.match(/\d{17,19}/)[0])
      .catch(() => null);

    if (!user) {
      return message.channel.send({ content: `<a:Wrong:812104211361693696> | ${message.author}, User could not be found! Please ensure the supplied ID is valid.` });
    };

    if (user.id === message.guild.ownerId) {
      return message.channel.send({ content: `<a:Wrong:812104211361693696> | ${message.author}, You cannot ban a server owner!` });
    };

    member = await message.guild.members
      .fetch(user.id)
      .catch(() => false);

    if (!!member) {
      return message.channel.send({ content: `<a:Wrong:812104211361693696> | ${message.author}, The user is already in the server! Please use \`ban\` command instead if the user is in your server.` });
    };

    if (user.id === message.author.id) {
      return message.channel.send({ content: `<a:Wrong:812104211361693696> | ${message.author}, You cannot ban yourself!` });
    };

    if (user.id === client.user.id) {
      return message.channel.send({ content: `<a:Wrong:812104211361693696> | ${message.author}, You cannot don't ban me!` });
    };

    if (client.owners.includes(user.id)) {
      return message.channel.send({ content: `<a:Wrong:812104211361693696> | ${message.author}, You can't ban my developers through me!` })
    };

    await message.channel.send({ content: `Are you sure you want to ban **${user.tag}** from this server? \`(y/n)\`` })

    const filter = _message => message.author.id === _message.author.id && ['y', 'n', 'yes', 'no'].includes(_message.content.toLowerCase());

    const proceed = await message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
      .then(collected => ['y', 'yes'].includes(collected.first().content.toLowerCase()) ? true : false)
      .catch(() => false);

    if (!proceed) {
      return message.channel.send({ content: `<a:Wrong:812104211361693696> | ${message.author}, Cancelled the \`hackban\` command!` });
    };

    return message.guild.members.ban(user, { reason: `Wolfy Hackban Command: ${message.author.tag}: ${reason.join(' ') || 'Unspecified'}` })
      .then(_user => message.reply({ content: `<a:Correct:812104211386728498> | Successfully banned **${_user.tag}** from this server!` }))
      .catch(() => message.channel.send({ content: `Failed to ban **${user.tag}**!` }));
  }
}