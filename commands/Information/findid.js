const discord = require('discord.js');

module.exports = {
    name: "findid",
    aliases: ["FindId", "FINDID"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<user>',
    cooldown: 1, //seconds(s)
    guarded: false, //or false
    permissions: [""],
    clientpermissions: [""],
    async execute(client, message, args) {
        var user = message.mentions.users.first() || message.author
        let avatar = user.displayAvatarURL()
     
    const embed = new discord.MessageEmbed()
    .setColor("WHITE")
    .setAuthor(`Requested by ${message.author.username}`, message.author.displayAvatarURL())
    .setThumbnail(avatar)
    .setDescription(`**USER ID:** ${user.id}`)
    .setTimestamp()
    message.channel.send(embed);
    }
}