const Discord = require('discord.js');
const mcapi = require('mcapi');
const { prefix } = require('../../config.json');

module.exports = {
    name: "mcuser",
    aliases: ["Mcuser", "MCUSER"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<player>',
    cooldown: 2, //seconds(s)
    guarded: false, //or false
    clientpermissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS", "ATTACH_FILES"],
    async execute(client, message, args) {
    let embed1 = new Discord.MessageEmbed()
    .setTitle('Error!')
    .setDescription(`**Required Arguments** \n \`\`\`${prefix}mcuser <username> \`\`\``)
    .setColor('ORANGE')

    if(!args[0]) return message.channel.send(embed1)

    try{
        let uuid = await mcapi.usernameToUUID(`${args.join(" ")}`)
        let embed = new Discord.MessageEmbed()
        .setTitle(`User: ${args.join(" ")}`)
        .addField("Name:", `${args.join(" ")}`)
        .addField("UUID:", uuid)
        .addField("Download:", `[Download](https://minotar.net/download/${args.join(" ")})`)
        .addField("NameMC:", `[Click Here](https://mine.ly/${args.join(" ")}.1)`)
        .setImage(`https://minecraftskinstealer.com/api/v1/skin/render/fullbody/${args.join(" ")}/700`)
        .setColor('RANDOM')
        .setThumbnail(`https://minotar.net/cube/${args.join(" ")}/100.png)`)
        message.channel.send(embed);
    } catch(e) {
        let embed2 = new Discord.MessageEmbed()
        .setDescription('The specified user was not found!')
        message.channel.send(embed2)
    }
}
}
