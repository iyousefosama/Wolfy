const discord = require('discord.js');

module.exports = {
    name: "serveravatar",
    aliases: ["Serveravatar", "SERVERAVATAR", "savatar"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    clientpermissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS", "ATTACH_FILES"],
    async execute(client, message, args) {
    if (message.channel.type === "dm") return;
    let avatarserver = new discord.MessageEmbed()
    .setColor("RANDOM")
    .setAuthor(message.guild.name, message.guild.iconURL())
    .setTitle("Avatar Link")
    .setURL(message.guild.iconURL())
    .setImage (message.guild.iconURL({dynamic: true, format: 'png', size: 512}))
    .setFooter(`Requested By ${message.author.tag}`, message.author.avatarURL())
    message.channel.send({ embeds: [avatarserver] })
    }
}