const discord = require('discord.js')

module.exports = {
    name: "slowmode",
    aliases: ["Slowmode", "SLOWMODE"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<time>',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    permissions: ["MANAGE_CHANNELS", "ADMINISTRATOR"],
    clientpermissions: ["MANAGE_CHANNELS", "ADMINISTRATOR"],
    async execute(client, message, args) {

    let time = args[0]
    if(!time) return message.channel.send("<a:pp802:768864899543466006> Please provide a time in seconds")
    if(isNaN(time)) return message.channel.send("<a:pp802:768864899543466006> Please provide a valid number")

    message.channel.setRateLimitPerUser(time, 'No Reason')

    var dn = new discord.MessageEmbed()
    .setColor(`DARK_GREEN`)
    .setDescription(`<a:Correct:812104211386728498> Successfully set the slowmode on this channel ${time} seconds`)
    var msg = message.channel.send(dn)
    .catch(err => {
        const UnknownErr = new discord.MessageEmbed()
        .setColor(`RED`)
        .setDescription(`<a:pp802:768864899543466006> Error, please report this to on our support server!`)
        .setURL(`https://discord.gg/qYjus2rujb`)
        message.channel.send(UnknownErr)
        console.error(err);
      })
}
}