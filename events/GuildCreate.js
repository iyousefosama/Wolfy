const Discord = require('discord.js')

module.exports = {
    name: 'guildCreate',
    async execute(client, guild, guildCreate) {
        const join = new Discord.MessageEmbed()
        .setTitle(`${client.user.username} added to a new server!`)
        .setColor("GREEN")
        .setThumbnail(guild.iconURL({dynamic: true, format: 'png', size: 512}))
        .setDescription(`<a:pp224:853495450111967253> Server Name:\n\`\`\`${guild.name}\`\`\` \n<:pp833:853495153280155668> MembersCount:\n\`\`\`${guild.memberCount}\`\`\`\n\n<a:pp330:853495519455215627> Total servers: \`\`\`\n${client.guilds.cache.size}\`\`\`\n<a:pp330:853495519455215627> Total users: \n\`\`\`${client.users.cache.size}\`\`\``)
        .setTimestamp()
        const bot = client.user.username;
        await client.channels.cache.get('840892477614587914')?.createWebhook(bot, {
            avatar: client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 128 })
          })
          .then(webhook => Promise.all([webhook.send({ embeds: [join] }), webhook]))
          .then(([_, webhook]) => webhook.delete())
          .catch(() => {});
        
          // add more functions on ready  event callback function...
        
          return;
    }
}
