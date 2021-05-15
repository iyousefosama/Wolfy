const discord = require('discord.js');

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    if(message.author.bot) return;
    if(message.author.id !== '724580315481243668') return;
    Client.guilds.cache.forEach(r => 
        message.channel.send(`**Server ID:** \`${r.id}\`\n:id: **ServerName:** \`${r.name}\`\n:busts_in_silhouette: **ServerMembers:** \`${r.memberCount}\`\n:date: **ServerCreatedAt:** \`${r.createdAt.toLocaleString()}\`\n:earth_africa: **ServerRegion:** \`${r.region}\`\n:bar_chart: **ServerVerificationLevel:** \`${r.verificationLevel}\`\n:frame_photo: **ServerIcon:** ${r.iconURL()}`))

}

    

module.exports.help = {
    name: "guildsinfo",
    aliases: ['bot-guilds', 'guilds', 'Guilds', 'Guildsinfo', 'guilds-info']
}