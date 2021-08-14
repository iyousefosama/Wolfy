const discord = require('discord.js');

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    if (!message.guild.me.permissions.has("SEND_MESSAGES") || !message.guild.me.permissions.has("EMBED_LINKS") || !message.guild.me.permissions.has("USE_EXTERNAL_EMOJIS") || !message.guild.me.permissions.has("ADD_REACTIONS") || !message.guild.me.permissions.has("VIEW_CHANNEL") || !message.guild.me.permissions.has("ATTACH_FILES") || !message.guild.me.permissions.has("READ_MESSAGE_HISTORY") || !message.guild.me.permissions.has("READ_MESSAGE_HISTORY")) return;
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