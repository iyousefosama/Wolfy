const discord = require('discord.js');

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    if(!message.member.guild.me.hasPermission([SEND_MESSAGES, EMBED_LINKS, USE_EXTERNAL_EMOJIS])) return;
    if(!args[2]) return message.reply("Please type a full Question");
    let replies = ["<a:Correct:812104211386728498> Yes.","<a:Wrong:812104211361693696> No.","<:OH:841321886368792647> I don't know","<a:pp993:836168681746071552> Ask again later I'm Busy","Well yes but Actually No.", "Yes...,Sorry I mean No."];
    
    let result = Math.floor((Math.random() * replies.length));
    let question = args.slice(1).join(" ");
    
    const eightball = new discord.MessageEmbed()
  .setAuthor(Client.user.username, Client.user.displayAvatarURL())
  .setTitle("My Answer is!")
  .setColor('#dfb86d')
  .setDescription(`${replies[result]}`)
  .setFooter(Client.user.username, Client.user.displayAvatarURL())
  .setTimestamp()
    
message.channel.send(message.author, eightball);

}

    

module.exports.help = {
    name: "8ball",
    aliases: ['']
}