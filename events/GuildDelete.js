const Discord = require('discord.js')

module.exports = {
    name: 'guildDelete',
    async execute(client, guild, guildDelete) {
            const left = new Discord.MessageEmbed()
            .setTitle(`${client.user.username} left a server!`)
            .setThumbnail(guild.iconURL({dynamic: true, format: 'png', size: 512}))
            .setColor("RED")
            .setDescription(`I left **${guild.name}**, with **${guild.memberCount}** members\n\nTotal servers: ${client.guilds.cache.size}\nTotal users: ${client.users.cache.size}`)
            .setDescription(`<a:pp224:853495450111967253> Server Name:\n\`\`\`${guild.name}\`\`\` \n<:pp833:853495153280155668> MembersCount:\n\`\`\`${guild.memberCount}\`\`\`\n\n<a:pp833:853495989796470815> Total servers: \`\`\`\n${client.guilds.cache.size}\`\`\`\n<a:pp833:853495989796470815> Total users: \n\`\`\`${client.users.cache.size}\`\`\``)
            .setTimestamp()
            const bot = client.user.username;
            await client.channels.cache.get('840892477614587914')?.createWebhook(bot, {
                avatar: client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 128 })
              })
              .then(webhook => Promise.all([webhook.send({ embeds: [left] }), webhook]))
              .then(([_, webhook]) => webhook.delete())
              .catch(() => {});
            
              // add more functions on ready  event callback function...
            
              return;
    }
}
