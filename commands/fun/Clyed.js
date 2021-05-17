const discord = require('discord.js');
const axios = require('axios');
const { MessageEmbed } = require('discord.js');

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    if(question.length > 100) return message.channel.send('Sorry you can\`t type more than 100 letters!')
    if(!args[0]) return message.channel.send('Please provide some text');
    axios
    .get(`https://nekobot.xyz/api/imagegen?type=clyde&text=${args.join(" ")}`)
    .then((res) => {
        const embed = new MessageEmbed()
        .setImage(res.data.message)
        message.channel.send(embed)
    })

}

    

module.exports.help = {
    name: "clyed",
    aliases: ['']
}