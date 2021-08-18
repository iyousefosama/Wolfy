const discord = require('discord.js');
const client = new discord.Client(); // creating a new Client

module.exports = {
    name: "ping",
    aliases: ["PING", "Ping"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '<> <>',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    permissions: ["USE_EXTERNAL_EMOJIS"],
    async execute(client, message, args) {
        var loading = new discord.MessageEmbed()
        .setColor(`GOLD`)
        .setDescription(`<a:Loading_Color:759734580122484757> Finding bot ping...`)
        var msg = message.channel.send(loading).then(msg => { // sends this once you send the cmd
        const ping = msg.createdTimestamp - message.createdTimestamp; // calculation the time between when u send the message and when the bot reply
        let Pong = new discord.MessageEmbed()
        .setColor(`Yellow`)
        .setDescription(`Pong!`)
        msg.edit(Pong)
        let Ping = new discord.MessageEmbed()
        .setColor(`DARK_GREEN`)
        .setDescription(`The Ping of the bot is \`${ping}ms\`!`)
        msg.edit(Ping)
    })
}
}