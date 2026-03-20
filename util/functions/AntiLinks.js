const UserSchema = require('../../schema/Infraction-Schema')
const InfFunction = require('./Infraction')
const { PermissionsBitField } = require('discord.js')

/**
 * @param {import('../../struct/Client')} client
 * @param {import('discord.js').Message} message
 * @param {Object | null} guildData
 */
const checkMsg = async (client, message, guildData = null) => {
  if (!message) {
    return;
  }

  if (message.author == client.user) return;
  if (message.author.bot) {
    return;
  }
  if (!message.guild) {
    return;
  }

  let resolvedGuildData = guildData;

  try {
    if (!resolvedGuildData) {
      resolvedGuildData = await client.getCachedGuildData(message.guild.id);
    }
  } catch (err) {
    console.log(err)
    return message.channel.send(`\`âŒ [DATABASE_ERR]:\` The database responded with error: ${err.name}`)
  }

  if (message.author.id === message.guild.ownerId) {
    return;
  } else if (message.channel?.permissionsFor(message.member).has(PermissionsBitField.Flags.Administrator)) {
    return;
  } else if (!resolvedGuildData?.Mod?.AntiLink?.isEnabled) {
    return;
  }

  let data;
  try {
    data = await UserSchema.findOne({
      guildId: message.guild.id,
      userId: message.author.id
    })
    if (!data) {
      data = await UserSchema.create({
        guildId: message.guild.id,
        userId: message.author.id
      })
    }
  } catch (err) {
    console.log(err)
    return message.channel.send(`\`âŒ [DATABASE_ERR]:\` The database responded with error: ${err.name}`)
  }

  if (!data) {
    return;
  }

  if (
    message.content.toLowerCase().includes(`http://`) ||
    message.content.toLowerCase().includes(`https://`) ||
    message.content.toLowerCase().includes(`discord.gg/`)
  ) {
    message.delete().then(() => {
      setTimeout(async () => {
        if (resolvedGuildData.Mod.Infraction?.isEnabled) {
          InfFunction.Infraction(client, message)
        } else {
          return message.channel?.send({ content: `${message.author}, Links and discord invites are not allowed in this server!` })
        }
      }, 100)
    })
  }
};

module.exports = checkMsg;
