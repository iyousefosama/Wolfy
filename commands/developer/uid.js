const discord= require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "uid",
    aliases: ["UID", "Uid"],
    dmOnly: false, //or false
    guildOnly: false, //or false
    args: false, //or false
    usage: '<type>',
    group: 'developer',
    cooldown: 1, //seconds(s)
    guarded: false, //or false
    OwnerOnly: true,
    async execute(client, message, args) {
        const head = Date.now().toString(36);
        const tail = Math.random().toString(36).substr(2);

        let uid = head + tail;

        message.reply({ content: `\\✔️ Successfully created the uid \`${uid}\`!`})
    }
}