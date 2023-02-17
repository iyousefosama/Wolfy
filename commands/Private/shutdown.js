const discord = require('discord.js');

module.exports = {
    name: "shutdown",
    aliases: ["Shutdown", "SHUTDOWN"],
    dmOnly: false, //or false
    guildOnly: false, //or false
    args: false, //or false
    usage: '',
    group: 'developer',
    cooldown: 10, //seconds(s)
    guarded: false, //or false
    OwnerOnly: true,
    permissions: [],
    async execute(client, message, args) {

    var loading = new discord.EmbedBuilder()
    .setColor(`Yellow`)
    .setDescription(`<a:Loading_Color:759734580122484757> Shutting down now...`)
    await message.channel.send({ embeds: [loading] })
    console.log(`Application closed by ${message.author.tag}`)
    .then(() => process.exit())
    .catch(() => message.channel.send(`\\❗ Could not perform the operation.`));
    }
}