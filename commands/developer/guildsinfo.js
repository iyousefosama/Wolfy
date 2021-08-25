const Discord = require('discord.js');

module.exports = {
    name: "guilds",
    aliases: ["Guilds", "GUILDS", "botguilds"],
    dmOnly: false, //or false
    guildOnly: false, //or false
    args: false, //or false
    usage: '',
    cooldown: 60, //seconds(s)
    guarded: false, //or false
    OwnerOnly: true,
    clientpermissions: ["EMBED_LINKS", "ATTACH_FILES"],
    async execute(client, message, args) {
        let clientGuilds = message.client.guilds.cache;
        let messageObj = Discord.Util.splitMessage(
            clientGuilds.map(g => '<a:Down:853495989796470815> Guilds Name **|** GuildsID **|** OwnerID **|** MembersCount **|** IconURL <a:Down:853495989796470815>\n\n\`' + g.name + `\` **|** \`` + g.id + `\` **|** \`` + g.ownerID + '\` **|** \`' + g.members.cache.size + '\` **|** *' + g.iconURL() + '*') || 'None'
        );
        if (messageObj.length == 1) {
            message.channel.send(messageObj[0])
        } else {
            for (i = 0; messageObj.length < i; i++) {
                message.channel.send(messageObj[i])
            }
        }
    }
}
