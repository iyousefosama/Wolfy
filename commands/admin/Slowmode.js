const discord = require('discord.js')

module.exports = {
    name: "slowmode",
    aliases: ["Slowmode", "SLOWMODE"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<time>',
    group: 'Moderation',
    description: 'Adding slowmotion chat to a channel',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    permissions: ["MANAGE_CHANNELS"],
    clientpermissions: ["MANAGE_CHANNELS"],
    examples: [
      '5s'
    ],
    async execute(client, message, args) {

    let time = args[0]
    let reason = args.slice(1).join(" ")
    if (!args[1]) reason = 'No reason specified'
    if(!time) return message.channel.send({ content: "<a:pp802:768864899543466006> Please provide a time in seconds"})
    if(isNaN(time)) return message.reply({ content: "<a:pp802:768864899543466006> Please provide a valid number"})
    if (time < 0 || time > 21600){
      return message.reply({ content: `<a:Wrong:812104211361693696> | ${message.author}, Please provide the number of slowmode with seconds between \`(0) and (21600)\`!`});
    };

    message.channel.setRateLimitPerUser(time, reason)

    var dn = new discord.MessageEmbed()
    .setColor(`DARK_GREEN`)
    .setDescription(`<a:Correct:812104211386728498> Successfully set the slowmode on this channel ${time} second(s)`)
    var msg = message.channel.send({ embeds: [dn] })
    .catch(err => {
      const UnknownErr = new discord.MessageEmbed()
      .setColor(`RED`)
      .setDescription(`<a:pp802:768864899543466006> Error, please report this with \`w!feedback\`!`)
      message.channel.send({ embeds: [UnknownErr] })
        console.error(err);
      })
}
}