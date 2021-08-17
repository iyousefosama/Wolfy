const discord = require('discord.js');

module.exports = {
    name: "guilds",
    aliases: ["Guilds", "GUILDS", "botguilds"],
    dmOnly: false, //or false
    guildOnly: false, //or false
    args: false, //or false
    usage: '',
    cooldown: 960, //seconds(s)
    guarded: false, //or false
    clientpermissions: ["EMBED_LINKS", "ATTACH_FILES"],
    async execute(client, message, args) {
    if(message.author.id !== '829819269806030879') return;
    client.guilds.cache.forEach(r => 
        message.channel.send(`**Server ID:** \`${r.id}\`\n:id: **ServerName:** \`${r.name}\`\n:busts_in_silhouette: **ServerMembers:** \`${r.memberCount}\`\n:date: **ServerCreatedAt:** \`${r.createdAt.toLocaleString()}\`\n:earth_africa: **ServerRegion:** \`${r.region}\`\n:bar_chart: **ServerVerificationLevel:** \`${r.verificationLevel}\`\n:frame_photo: **ServerIcon:** ${r.iconURL()}`))
    }
}