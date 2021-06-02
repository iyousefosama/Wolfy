const discord = require('discord.js');

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    if(!args[2]) return message.reply("Please type a full Question");
    let replies = ["Yes.","No.","I don't know","Ask again later I'm Busy","Well yes but Actually No.", "Yes...,Sorry I mean No."];
    
    let result = Math.floor((Math.random() * replies.length));
    let question = args.slice(1).join(" ");
    
    const eightball = new discord.MessageEmbed()
  .setTitle("My Answer is")
  .setColor('RANDOM')
  .setDescription(`${replies[result]}`)
    
message.channel.send(message.author, eightball);

}

    

module.exports.help = {
    name: "8ball",
    aliases: ['']
}