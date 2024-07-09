const discord = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const warnSchema = require('../../schema/Warning-Schema')

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
    name: "warnings",
    aliases: ["Warnings", "WARNINGS", "Warns", "warns", "WARNS"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<user>',
    description: 'Display the mentioned user warns list and ids',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    permissions: ["Administrator"],
    examples: [
        '@BadGuy',
        '742682490216644619'
        ],
        
    async execute(client, message, [user = '']) {

        if (!user.match(/\d{17,19}/)){
            return message.channel.send({ content: `<a:Wrong:812104211361693696> | ${message.author}, Please mention the user or provide the id to get warns list.`});
          };
      
          user = await message.guild.members
          .fetch(user.match(/\d{17,19}/)[0])
          .catch(() => null);
      
          if (!user){
            return message.channel.send({ content: `<a:Wrong:812104211361693696> | ${message.author}, User could not be found!`});
          };
      
          member = await message.guild.members
          .fetch(user.id)
          .catch(() => false);

          const warnedResult = await warnSchema.findOne({
            guildId: message.guild.id,
            userId: user.id,
        });

        if (!warnedResult || warnedResult.warnings.length === 0)
        return message.reply({
            content: `<a:Wrong:812104211361693696> | ${message.author}, I couldn't found user warns list!`
        });

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${user.user.username}\'s Warn list!`, iconURL: user.user.displayAvatarURL({dynamic: true, size: 2048}) })
            .setColor('#2F3136')
            .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL({dynamic: true, size: 2048}) })
            .setTimestamp()

        const getWarnedUser = message.guild.members.cache.find(
            (user) => user.id === warnedResult.userId,
        );
        for (const warning of warnedResult.warnings) {
            const { authorId, timestamp, warnId, reason } = warning;
            const getModeratorUser = message.guild.members.cache.find(
                (user) => user.id === authorId,
            );
            embed
                .addFields({ name: `Moderator: ${getModeratorUser.user.tag} (\`${warnId}\`)`, value: `• *Warn Reason:* ${reason}\n• *Warned At:* <t:${timestamp}>`})
        }

        message.reply({ embeds: [embed] });
}
}