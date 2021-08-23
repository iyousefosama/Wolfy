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
    clientpermissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS", "ATTACH_FILES"],
    async execute(client, message, args) {
    if(!args[0]) return message.channel.send('Please provide some text');
    if(args.join(" ").length > 100) return message.channel.send('<a:Wrong:812104211361693696> Sorry you can\`t type more than \`100 letters!\`')
    axios
    .get(`https://nekobot.xyz/api/imagegen?type=clyde&text=${args.join(" ")}`)
    .then((res) => {
        const embed = new MessageEmbed()
        .setImage(res.data.message)
        message.channel.send(embed)
    })
    .catch(err => {
        message.channel.send('<a:Error:836169051310260265> Error!');
      })
    }
}