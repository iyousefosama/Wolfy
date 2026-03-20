const { EmbedBuilder } = require('discord.js')
const uuid = require('uuid');
const warnSchema = require('../../schema/Warning-Schema')
const { PermissionsBitField } = require('discord.js')

/**
 * @param {import('../../struct/Client')} client
 * @param {import('discord.js').Message} message
 * @param {Object | null} guildData
 */
const badWordChecker = async (client, message, guildData = null) => {
    if (!message) {
      return;
    }

    if (!message.guild || message.author.bot) return;
    if (message.author == client.user) return;
    if (message.author.bot) {
      return;
    }

    let data = guildData;
    if (!data && message.guild) {
      try {
        data = await client.getCachedGuildData(message.guild.id)
        if (!data) return;
      } catch (err) {
        console.log(err)
      }
    }

    if (message.author.id === message.guild.ownerId) {
      return;
    } else if (message.channel?.permissionsFor(message.member).has(PermissionsBitField.Flags.Administrator)) {
      return;
    } else if (!data?.Mod?.BadWordsFilter?.isEnabled) {
      return;
    } else if (data.Mod.BadWordsFilter.BDW == null || data.Mod.BadWordsFilter.BDW.length == 0) {
      return;
    }

    if (data.Mod.BadWordsFilter.BDW.some(word => message.content.toLowerCase().includes(word))) {
      message.delete().then(msg => {
        setTimeout(async () => {
          const reason = `Automoderator: This word is banned, watch your language.`
          const warnObj = {
            authorId: client.user.id,
            timestamp: Math.floor(Date.now() / 1000),
            warnId: uuid.v4(),
            reason: reason,
          };

          const warnAddData = await warnSchema.findOneAndUpdate(
            {
              guildId: message.guild.id,
              userId: message.author.id,
            },
            {
              guildId: message.guild.id,
              userId: message.author.id,
              $push: {
                warnings: warnObj,
              },
            },
            {
              upsert: true,
            },
          );
          const warnCount = warnAddData ? warnAddData.warnings.length + 1 : 1;
          const warnGrammar = warnCount === 1 ? '' : 's';
          if (warnCount >= 20) {
            return msg.channel.send({ content: `\\âš ï¸ **${message.author.username}**, This word is banned, watch your language.` })
          }

          const warnEmbed = new EmbedBuilder()
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true, size: 2048 }) })
            .setColor('#e6a54a')
            .setTitle(`âš ï¸ Warned **${message.author.username}**`)
            .setDescription(`â€¢ **Warn Reason:** ${reason}\nâ€¢ **Warning${warnGrammar} Count:** ${warnCount}\nâ€¢ **Warned By:** ${client.user.tag}`)
            .setFooter({ text: client.user.tag, iconURL: client.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
          message.channel.send({ embeds: [warnEmbed] })

          const dmembed = new EmbedBuilder()
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true, size: 2048 }) })
            .setColor('#e6a54a')
            .setTitle(`âš ï¸ Warned **${message.author.username}**`)
            .setDescription(`â€¢ **Warn Reason:** ${reason}\nâ€¢ **Warning${warnGrammar} Count:** ${warnCount}\nâ€¢ **Warned By:** ${client.user.tag}`)
            .setFooter({ text: client.user.tag, iconURL: client.user.displayAvatarURL({ dynamic: true, size: 2048 }) })

          try {
            await message.author.send({ embeds: [dmembed] })
          } catch (error) {
            return;
          }
        }, 1000)
      })
    }
};

module.exports = badWordChecker;
