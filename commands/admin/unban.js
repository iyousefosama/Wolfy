const discord = require('discord.js');

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
    name: "unban",
    aliases: [],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<user>',
    group: 'Moderation',
    description: 'UnBans a member from the server',
    cooldown: 1, //seconds(s)
    guarded: false, //or false
    permissions: ["BanMembers"],
    clientPermissions: ["BanMembers"],
    examples: [
        '@FreeGuy',
        '829819269806030879'
      ],
      
    async execute(client, message, [ user = '', ...args ]) {

        if (!user.match(/\d{17,19}/)){
            return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, Please provide the ID of the user to unban`);
          };
      
          user = user.match(/\d{17,19}/)[0];
      
          return message.guild.members.unban(user, { reason: `Wolfy Unbans: ${message.author.tag}: ${args.join(' ') || 'None'}`})
          .then(user => message.reply(`<a:Correct:812104211386728498> Successfully unbanned **${user.tag}**!`))
          .catch(() => message.channel.send(`\\❌ Unable to unban user with ID ${user}.`));
}
}