const discord = require('discord.js');

module.exports = {
    name: "shutdown",
    aliases: ["Shutdown", "SHUTDOWN"],
    dmOnly: false, //or false
    guildOnly: false, //or false
    args: false, //or false
    usage: '',
    cooldown: 10, //seconds(s)
    guarded: false, //or false
    OwnerOnly: true,
    async execute(client, message, args) {

    var loading = new discord.MessageEmbed()
    .setColor(`YELLOW`)
    .setDescription(`<a:Loading_Color:759734580122484757> Shutting down now...`)
    var msg = await message.channel.send(loading)
  
    process.exit()
    }
}