const discord = require('discord.js');

module.exports = {
    name: "test",
    aliases: ["Test"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    async execute(client, message, args) {
}
}