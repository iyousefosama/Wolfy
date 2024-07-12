const discord = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const uuid = require('uuid');
const warnSchema = require('../../schema/Warning-Schema')

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
    name: "removewarn",
    aliases: ["remove-warn"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<user>',
    group: 'Moderation',
    description: 'Remove a user warn from the warns list by the id',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    permissions: ["Administrator"],
    examples: [
    '@WOLF 72c53c46-7449-4076-9af2-5acda635cbf4',
    '742682490216644619 72c53c46-7449-4076-9af2-5acda635cbf4'
    ], 
    
    async execute(client, message, [user = '', ...args]) {
        let id = args.slice(0).join(" ")
        if (!user.match(/\d{17,19}/)){
            return message.channel.send({ content: `<a:Wrong:812104211361693696> | ${message.author}, Please mention the user or provide the id to get warns list.`});
          };
      
          user = await message.guild.members
          .fetch(user.match(/\d{17,19}/)[0])
          .catch(() => null);
      
          if (!user){
            return message.channel.send({ content: `<a:Wrong:812104211361693696> | ${message.author}, User could not be found!`});
          };

          if (!id){
            return message.channel.send({ content: `<a:Wrong:812104211361693696> | ${message.author}, Please provide a warn reason!`});
          };
      
          member = await message.guild.members
          .fetch(user.id)
          .catch(() => false);

          const validateUUID = uuid.validate(id);

          if (validateUUID) {
              const warnedRemoveData = await warnSchema.findOneAndUpdate(
                  {
                      guildId: message.guild.id,
                      userId: user.id,
                  },
                  {
                      $pull: { warnings: { warnId: `${id}` } },
                  },
              );

              const getRemovedWarnedUser = message.guild.members.cache.find(
                  (user) => user.id === warnedRemoveData.userId,
              );

              const warnedRemoveCount = warnedRemoveData
                  ? warnedRemoveData.warnings.length - 1
                  : 0;
              const warnedRemoveGrammar = warnedRemoveCount === 1 ? '' : 's';


              const embed = new EmbedBuilder()
              .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({dynamic: true, size: 2048}) })
              .setDescription(`<a:pp989:853496185443319809> **Successfully** deleted ${getRemovedWarnedUser.user.tag} warning!\nWarning${warnedRemoveGrammar} count: \`${warnedRemoveCount}\``)
              .setTimestamp()
              message.channel.send({ embeds: [embed] });
          } else {
              message.reply({ content: `\\❌ **${message.member.displayName}**, please provide a valid warn id.`});
          }
}
}