const discord = require('discord.js');
const _ = require('lodash');

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return
    const embed = new discord.MessageEmbed()
    .setAuthor(`${message.guild.name} Roles List`)
    .addFields(
      _.chunk(message.guild.roles.cache.array()
        .filter(x => x.id !== message.guild.id)
        .sort((A,B) => B.rawPosition - A.rawPosition), 10)
        .map(x => {
          return {
            name: '\u200b', inline: true,
            value: '\u200b' + x.map(x => `\u2000•\u2000${x}`).join('\n')
          };
        })
    )
    message.channel.send(embed)
}

module.exports.help = {
    name: 'test4',
    aliases: []
}