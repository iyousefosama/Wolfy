const discord = require('discord.js');

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
          if (!message.channel.guild || message.author.bot) return;
          if (!message.guild.member(message.author).hasPermission("MOVE_MEMBERS"))
          var Messingperms = new discord.MessageEmbed()
    .setColor(`RED`)
    .setDescription(`<a:pp802:768864899543466006> You don't have permission to use that command.`)
    message.channel.send(Messingperms)
    if (!message.guild.member(message.author).hasPermission("MOVE_MEMBERS")) return;
          if (!message.guild.member(Client.user).hasPermission("MOVE_MEMBERS"))
            return message.channel.send("Please Check My Permission");
          if (!message.member.voice.channel)
            return message.channel.send("Your are not in voice channel");
          if (!user) return message.channel.send(`**${prefix}vkick <@mention or id>**`);
          if (!message.guild.member(user).voice.channel)
            return message.channel.send(
              `**${username}** Has not in Voice channel`
            );
          await user.voice.kick()
          message.channel.send(
            `**${username}** has been kicked from **Voice Channel**`
          )

}

    

module.exports.help = {
    name: "vkick",
    aliases: ['vkick']
}