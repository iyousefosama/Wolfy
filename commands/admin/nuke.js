const discord = require('discord.js');

module.exports = {
    name: "nuke",
    aliases: ["Nuke", "NUKE"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    group: 'Moderation',
    description: 'ReCreate any channel without messages (this will delete all the channel and create newone!)',
    cooldown: 20, //seconds(s)
    guarded: false, //or false
    permissions: ["MANAGE_MESSAGES", "MANAGE_CHANNELS"],
    clientpermissions: ["MANAGE_MESSAGES", "MANAGE_CHANNELS"],
    examples: [''],
    async execute(client, message, args) {

    await message.channel.send(`Are you sure you want to nuke ${message.channel}? \`(y/n)\``);

    const filter = _message => message.author.id === _message.author.id && ['y','n','yes','no'].includes(_message.content.toLowerCase());
    const proceed = await message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
    .then(collected => ['y','yes'].includes(collected.first().content.toLowerCase()) ? true : false)
    .catch(() => false);

    if (!proceed){
      return message.channel.send(`\\❌ | **${message.author.tag}**, Cancelled the \`nuke\` command!`);
    };

    let nuke = new discord.MessageEmbed()
    .setColor(`RED`)
    .setDescription(`<a:Error:836169051310260265> This channel will be nuked after \`(3 Seconds)\``)
    return message.channel.send({ embeds: [nuke] })
    .then(() => setTimeout(() => message.channel.clone()
    .then(() => message.channel.delete().catch(() => null)), 3000))
}
}