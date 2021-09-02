const discord = require('discord.js');
const axios = require('axios');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "clyed",
    aliases: ["Clyed", "CLYED"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<text>',
    cooldown: 2, //seconds(s)
    guarded: false, //or false
    clientpermissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS", "ATTACH_FILES", "READ_MESSAGE_HISTORY"],
    async execute(client, message, args) {
    message.channel.sendTyping()
    if(!args[0]) return message.reply({ content: `${message.author}, Please provide some text!`});
    if(args.join(" ").length > 100) return message.reply({ content: '<a:Wrong:812104211361693696> Sorry you can\`t type more than \`100 letters!\`' })
    axios
    .get(`https://nekobot.xyz/api/imagegen?type=clyde&text=${args.join(" ")}`)
    .then((res) => {
        const embed = new MessageEmbed()
        .setImage(res.data.message)
        message.reply({ embeds: [embed] })
    })
    .catch(err => {
        message.reply({ content: '<a:Error:836169051310260265> **|** Incorrect input, please try again!'});
      })
    }
}