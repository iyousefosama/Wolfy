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
    permissions: [""],
    clientpermissions: ["USE_EXTERNAL_EMOJIS"],
    async execute(client, message, args) {
    if(!args[0]) return message.channel.send('Please provide some text');
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