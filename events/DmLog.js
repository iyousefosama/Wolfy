const Discord = require('discord.js')

module.exports = {
    name: 'message',
    execute(client, message) {
        if (message.author == client.user) return;
        if (message.author.bot){
            return;
          };
        if (message.channel.type === "dm") {
        const dmEmbed = new Discord.MessageEmbed()
        .setTitle('New DM')
        .setColor("738ADB")
        .setTimestamp()
        .setDescription(`**User:** ${message.author.tag}\n**User ID:** ${message.author.id}\n**At:** ${new Date()}\n\n**Content:** \`\`\`${message.content}\`\`\``)
        .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
        const DMC = client.channels.cache.get('877130715337220136')
        DMC.send(dmEmbed)
    }
}
}