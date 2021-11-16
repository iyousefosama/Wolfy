const discord = require('discord.js');
const { MessageEmbed } = require('discord.js')

module.exports = {
  name: "avatar",
  aliases: ["Avatar", "AVATAR"],
  dmOnly: false, //or false
  guildOnly: true, //or false
  args: false, //or false
  usage: '<user>',
  group: 'Informations',
  description: 'Get a user\'s avatar.',
  cooldown: 1, //seconds(s)
  guarded: false, //or false
  permissions: [],
  clientpermissions: ["EMBED_LINKS", "ATTACH_FILES"],
  examples: [
    '@WOLF',
    '724580315481243668',
    ''
  ],
  async execute(client, message, [user = '']) {
    let color;

    if (message.guild){
      const id = (user.match(/\d{17,19}/)||[])[0] || message.author.id;

      member = await message.guild.members.fetch(id)
      .catch(() => message.member);

      color = member.displayColor || '738ADB';
      user = member.user;
    } else {
      color = '738ADB';
      user = message.author;
    };

    const avatar = user.displayAvatarURL({ dynamic: true, size: 1024 });

    const embed = new MessageEmbed()
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setColor(color)
    .setDescription(`[**${user.tag}** avatar link](${avatar})`)
    .setURL(avatar)
    .setImage(avatar)
    .setFooter('Avatar')
    .setTimestamp()
    message.channel.send({ embeds: [embed]})
  }
}