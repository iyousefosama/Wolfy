const discord = require('discord.js');

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    const { channel, mentions } = message;
    const target = mentions.members.first();

    if (!target) {
      return await message.delete().then(() => {
        channel.send(`Please specify someone to give a cookie to`);
      });
    } else {
      const cookieOptions = [
        `Hey, ${target}. You just got a cookie from ${message.author}! [🍪]`,
        `Hey, ${target}. You just got a cookie (and a secret hot chocolate) from ${message.author}! [🍪☕]`,
        `Hey, ${target}. You just got a cookie (+1 secret cookie) from ${message.author}! [🍪🍪]`,
      ];

      const RCC = Math.floor(Math.random() * cookieOptions.length);

      
        channel.send(cookieOptions[RCC]);
    }


}

    

module.exports.help = {
    name: "cookie",
    aliases: ['Cookie']
}