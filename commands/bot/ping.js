const discord = require('discord.js');

module.exports = {
    name: "ping",
    aliases: ["PING", "Ping"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '<> <>',
    group: 'bot',
    description: 'Shows the bot ping',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    permissions: [],
    clientpermissions: ["USE_EXTERNAL_EMOJIS"],
    examples: [''],
    async execute(client, message, args) {
        var loading = new discord.MessageEmbed()
        .setColor('GOLD')
        .setDescription(`<a:Loading_Color:759734580122484757> Finding bot ping...`)
        var msg = message.channel.send({ embeds: [loading]}).then(msg => { // sends this once you send the cmd
        const ping = msg.createdTimestamp - message.createdTimestamp; // calculation the time between when u send the message and when the bot reply
        let Pong = new discord.MessageEmbed()
        .setColor('YELLOW')
        .setDescription(`Pong!`)
        msg.edit({ embeds: [Pong]})
        let Ping = new discord.MessageEmbed()
        .setColor('DARK_GREEN')
        .setDescription(`The Ping of the bot is \`${ping}ms\`!`)
        msg.edit({ embeds: [Ping] })
    })
}
}