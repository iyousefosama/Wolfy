const discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const warnSchema = require('../../schema/Warning-Schema')

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
    permissions: ["ADMINISTRATOR"],
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

        let string = '';
        const embed = new MessageEmbed()
            .setAuthor(`${user.user.username}\'s Warn list!`, user.user.displayAvatarURL({dynamic: true, size: 2048}))
            .setColor('#2F3136')
            .setDescription(string)
            .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true, size: 2048}))
            .setTimestamp()

        const getWarnedUser = message.guild.members.cache.find(
            (user) => user.id === warnedResult.userId,
        );
        for (const warning of warnedResult.warnings) {
            const { authorId, timestamp, warnId, reason } = warning;
            const getModeratorUser = message.guild.members.cache.find(
                (user) => user.id === authorId,
            );
            string += embed
                .addField(
                    `Moderator: ${getModeratorUser.user.tag} (\`${warnId}\`)`,
                    `• *Warn Reason:* ${reason}\n• *Warned At:* <t:${timestamp}>`,
                )
        }

        message.reply({ embeds: [embed] });
}
}