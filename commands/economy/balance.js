const discord = require('discord.js')
const economy = require('../../database/economy')

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return

    let user = message.mentions.users.first() || message.author || message.guild.members.cache.get(args[0]);

    const guildId = message.guild.id
    const userId = user.id
    const coins = await economy.Coins(guildId, userId)
    const coinsembed = new discord.MessageEmbed()
    .setColor(`GOLD`)
    .setDescription(`🪙 ${user.username} have now ${coins} coins.`)
    message.channel.send(coinsembed)
}

module.exports.help = {
    name: 'balance',
    aliases: ['bal']
}