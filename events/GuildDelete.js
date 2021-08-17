const Discord = require('discord.js')

module.exports = {
    name: 'guildDelete',
    execute(client, guild, guildDelete) {
            const left = new Discord.MessageEmbed()
            .setTitle(`${client.user.username} left a server!`)
            .setThumbnail(guild.iconURL({dynamic: true, format: 'png', size: 512}))
            .setColor("RED")
            .setDescription(`I left **${guild.name}**, with **${guild.memberCount}** members\n\nTotal servers: ${client.guilds.cache.size}\nTotal users: ${client.users.cache.size}`)
            .setDescription(`<a:pp224:853495450111967253> Server Name:\n\`\`\`${guild.name}\`\`\` \n<:pp833:853495153280155668> MembersCount:\n\`\`\`${guild.memberCount}\`\`\`\n\n<a:pp833:853495989796470815> Total servers: \`\`\`\n${client.guilds.cache.size}\`\`\`\n<a:pp833:853495989796470815> Total users: \n\`\`\`${client.users.cache.size}\`\`\``)
            .setTimestamp()
            const LogChannel = client.channels.cache.get('877130715337220136')
            LogChannel.send(left)
    }
}