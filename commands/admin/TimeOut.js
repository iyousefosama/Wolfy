const discord = require('discord.js');
const ms = require('ms')

module.exports = {
  name: "timeout",
  aliases: ["TimeOut", "TIMEOUT"],
  dmOnly: false, //or false
  guildOnly: true, //or false
  args: true, //or false
  usage: '<user> [time] (Optional: reason)',
  group: 'Moderation',
  description: 'Bans a member from the server',
  cooldown: 1, //seconds(s)
  guarded: false, //or false
  permissions: [discord.PermissionsBitField.Flags.Administartor],
  clientpermissions: [discord.PermissionsBitField.Flags.Administartor],
  examples: [
    '@BADGUY 5h Toxic member',
    '742682490216644619 5h'
  ],
  async execute(client, message, [ member = '', ...args]) {

    const owner = await message.guild.fetchOwner()
    let time;
    if(!args[0]) {
      return message.channel.send(`\\❌ | ${message.author}, Please type the time of timeout or \`'remove'\` to remove it!`)
    } else if(args[0] && args[0].toLowerCase() != 'remove') {
      time = ms(args[0])
    } else if(args[0].toLowerCase() == 'remove') {
      time = null
    }
    let reason = args.slice(1).join(" ")

    if (!member.match(/\d{17,19}/)){
      return message.channel.send(`\\❌ | ${message.author}, Please type the id or mention the user to ban.`);
    };

    if(!ms(args[0]) && args[0].toLowerCase() != 'remove') {
      return message.channel.send(`\\❌ | ${message.author}, Time could not be found! Please add the time of the timeout!`);
    }

    member = await message.guild.members
    .fetch(member.match(/\d{17,19}/)[0])
    .catch(() => null);

    if (!member){
      return message.channel.send(`\\❌ | ${message.author}, User could not be found! Please ensure the supplied ID is valid.`);
    } else if (member.id === message.author.id){
      return message.channel.send(`\\❌ | ${message.author}, You cannot timeout yourself!`);
    } else if (member.id === client.user.id){
      return message.channel.send(`\\❌ | ${message.author}, You cannot timeout me!`);
    } else if (member.id === message.guild.ownerId){
      return message.channel.send(`\\❌ | ${message.author}, You cannot timeout a server owner!`);
    } else if (client.owners.includes(member.id)){
      return message.channel.send(`\\❌ | ${message.author}, You can't timeout my developer through me!`);
    } else if (message.member.roles.highest.position < member.roles.highest.position){
      return message.channel.send(`\\❌ | ${message.author}, You can't timeout that user! He/She has a higher role than yours`);
    };

    if(args[0].toLowerCase() == 'remove') {
      return member.timeout(time || null, `Wolfy TIMEOUT: ${message.author.tag}: ${reason || 'Unspecified'}`)
      .then(() => message.channel.send({ content: `\\✔️ ${message.author}, Successfully removed timeout for the user **${member.user.tag}**!`}))
      .catch(() => message.channel.send(`\\❌ | ${message.author}, Unable to remove timeout **${member.user.tag}**!`));
    }

    return member.timeout(time, `Wolfy TIMEOUT: ${message.author.tag}: ${reason || 'Unspecified'}`)
    .then(() => message.channel.send({ content: `\\✔️ ${message.author}, Successfully timeout the user **${member.user.tag}**!`}))
    .catch(() => message.channel.send(`\\❌ | ${message.author}, Unable to timeout **${member.user.tag}**!`));
  }
}