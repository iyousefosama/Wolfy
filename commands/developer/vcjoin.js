const discord = require('discord.js');

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    if (message.channel.type === "dm") return;
    if(message.author.bot) return;
    if(message.author.id !== '724580315481243668') return;

          if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
            var  loading = new discord.MessageEmbed()
            .setColor(`GREEN`)
            .setDescription(`<a:Right:812104211386728498> I joined the vc!`)
            var msg = message.channel.send(loading)
          } else {
            message.reply('You must be in voicechannel');
          }
}

    

module.exports.help = {
    name: "vcjoin",
    aliases: ['']
}