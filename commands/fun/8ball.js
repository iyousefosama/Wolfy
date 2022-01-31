const discord = require('discord.js');

module.exports = {
  name: "8ball",
  aliases: ["8Ball", "8BALL"],
  dmOnly: false, //or false
  guildOnly: true, //or false
  args: true, //or false
  usage: '<question>',
  group: 'Fun',
  description: 'Ask the 8ball anything and it will answer',
  cooldown: 2, //seconds(s)
  guarded: false, //or false
  permissions: [],
  clientpermissions: ["USE_EXTERNAL_EMOJIS", "READ_MESSAGE_HISTORY"],
  examples: [
    'Is wolfy a good bot?',
    'Should i sleep after 1 hour?'
  ],
  async execute(client, message, args) {
    message.channel.sendTyping()
    if(!args[2]) return message.reply({ content: "Please type a full Question!"});
    let replies = ["<a:Correct:812104211386728498> Yes.","<a:Wrong:812104211361693696> No.","<:OH:841321886368792647> I don't know","<a:pp993:836168681746071552> Ask again later I'm Busy","Well yes but Actually No.", "Yes...,Sorry I mean No."];
    
    let result = Math.floor((Math.random() * replies.length));
    let question = args.slice(1).join(" ");
    
    const eightball = new discord.MessageEmbed()
  .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
  .setTitle("My Answer is!")
  .setColor('#dfb86d')
  .setDescription(`${replies[result]}`)
  .setFooter(client.user.username, client.user.displayAvatarURL())
  .setTimestamp()
    
message.reply({ embeds: [eightball] });
  }
}