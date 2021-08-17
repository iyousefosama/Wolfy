const Discord = require('discord.js')
const snipes = new Discord.Collection()

module.exports = {
    name: 'messageUpdate',
    execute(client, oldMessage, messageUpdate) {
        if (oldMessage.author.bot){
            return;
          };
        snipes.set(oldMessage.channel.id,oldMessage)

        const LogChannel = oldMessage.guild.channels.cache.get('831412872852013066')
        if (!LogChannel) return;
        const EditedLog = new Discord.MessageEmbed()
        .setTitle("Edited Message")
        .setDescription(`**User:** ${oldMessage.author.tag}\n**User ID:** ${oldMessage.author.id}\n**In: ${oldMessage.channel}**\n**At:** ${new Date()}\n\nOld Message: \`\`\`${oldMessage.content}\`\`\`\nNew Message: \`\`\`${messageUpdate.content}\`\`\``)
        .setColor('GOLD')
        .setThumbnail(oldMessage.author.displayAvatarURL({dynamic: true}))
        LogChannel.send(EditedLog)
    }
} 