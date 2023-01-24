const discord= require('discord.js');

module.exports = {
    name: "reverse",
    aliases: ["Reverse"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<args>',
    group: 'Fun',
    description: 'Reverse the words you want!',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    permissions: [],
    examples: [
        'Hello, everyone!',
        'Hello, World!'
      ],
    async execute(client, message, args) {
    message.channel.send(args.join(' ').split('').reverse().join(' ') || 'No text to reverse.')
}
}