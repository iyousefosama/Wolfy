const Discord = require('discord.js')
const snipes = new Discord.Collection()

module.exports = {
    name: 'messageDelete',
    execute(client, message, messageDelete) {
        if (message.author == client.user) return;
        if (message.author.bot){
            return;
          };
        snipes.set(message.channel.id, message)
    
        const LogChannel = message.guild.channels.cache.get('877130715337220136')
        if (!LogChannel) return;
        const DeletedLog = new Discord.MessageEmbed()
        .setTitle("Deleted Message")
        .setDescription(`**User:** ${message.author.tag}\n**User ID:** ${message.author.id}**\nIn: ${message.channel}**\n**At:** ${new Date()}\n\n**Content:** \`\`\`${message.content}\`\`\``)
        .setColor('RED')
        .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
        LogChannel.send(DeletedLog)
    }
}
