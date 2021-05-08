const discord = require('discord.js');

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    if(!message.channel.guild) return;
    if (!message.member.voice.channel)
    return message.channel.send("Your are not in voice channel");
    if (!message.member.hasPermission("MOVE_MEMBERS"))
    var Messingperms = new discord.MessageEmbed()
      .setColor(`RED`)
      .setDescription(`<a:pp802:768864899543466006> You don't have permission to use that command.`)
      message.channel.send(Messingperms)
      if (!message.member.hasPermission("MOVE_MEMBERS")) return;
    if(!message.guild.member(Client.user).hasPermission("MOVE_MEMBERS")) return;
   if (message.member.voiceChannel == null) return;
    var author = message.member.voiceChannelID;
    var m = message.guild.members.filter(m=>m.voiceChannel)
    message.guild.members.filter(m=>m.voiceChannel).forEach(m => {
    m.setVoiceChannel(author)
    })
    message.channel.send('\`Moved All Voice Members To Your Channel\`').then(m => m.delete(4000))

}

    

module.exports.help = {
    name: "moveall",
    aliases: ['Moveall']
}