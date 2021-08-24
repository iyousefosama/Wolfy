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
            clientGuilds.map(g => '\`' + g.name + `\` **|** \`` + g.id + `\` **|** \`` + g.members.cache.size + '\`') || 'None'
        );
        if (messageObj.length == 1) {
            const embed0 = new Discord.MessageEmbed()
            .setDescription(messageObj[0]);
            message.channel.send(embed0)
        } else {
            for (i = 0; messageObj.length < i; i++) {
                const embedi = new Discord.MessageEmbed()
                .setDescription(messageObj[i]);
                message.channel.send(embedi)
            }
        }
    }
}