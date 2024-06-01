const discord = require('discord.js');
const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "clyde",
    aliases: ["Clyde", "CLYDE"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<text>',
    group: 'Fun',
    description: 'Send your message as clyde text message',
    cooldown: 2, //seconds(s)
    guarded: false, //or false
    permissions: [],
    clientPermissions: [discord.PermissionsBitField.Flags.EmbedLinks, discord.PermissionsBitField.Flags.UseExternalEmojis, discord.PermissionsBitField.Flags.AttachFiles, discord.PermissionsBitField.Flags.ReadMessageHistory],
    examples: [
        'Hello you are ratelimit. lol',
        'Wolfy is cool!'
      ],
    async execute(client, message, args) {
    message.channel.sendTyping()
    if(!args[0]) return message.reply({ content: `${message.author}, Please provide some text!`});
    if(args.join(" ").length > 100) return message.reply({ content: '<a:Wrong:812104211361693696> Sorry you can\`t type more than \`100 letters!\`' })
    axios
    .get(`https://nekobot.xyz/api/imagegen?type=clyde&text=${args?.join(" ")}`)
    .then((res) => {
        const embed = new EmbedBuilder()
        .setImage(res.data.message)
        message.reply({ embeds: [embed] }).catch(() => null)
    })
    .catch(() => {
        message.reply({ content: '<a:Error:836169051310260265> **|** Incorrect input, please try again!'});
      })
    }
}