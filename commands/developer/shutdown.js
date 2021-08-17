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
    permissions: [""],
    clientpermissions: [""],
    async execute(client, message, args) {
    if (message.author != '829819269806030879') return

    var loading = new discord.MessageEmbed()
    .setColor(`YELLOW`)
    .setDescription(`<a:Loading_Color:759734580122484757> Shutting down now...`)
    var msg = await message.channel.send(loading)
  
    process.exit()
    }
}