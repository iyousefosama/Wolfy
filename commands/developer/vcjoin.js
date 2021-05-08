const discord = require('discord.js');

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    if(message.author.bot) return;
    if(message.author.id !== '742682490216644619') return;

          if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
            message.channel.send("<a:Right:812104211386728498> I joined the vc!")
          } else {
            message.reply('You must be in voicechannel');
          }
}

    

module.exports.help = {
    name: "vcjoin",
    aliases: ['']
}