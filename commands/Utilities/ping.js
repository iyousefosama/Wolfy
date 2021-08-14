const discord = require('discord.js');
const Client = new discord.Client(); // creating a new Client
const cooldown = new Set();

module.exports.run = async (Client, message, args, prefix) => { // for the cmd handler 
    if(!message.content.startsWith(prefix)) return; // makes sure it starts with the prefix
    if(!message.channel.permissionFor(Client.user).has([SEND_MESSAGES, EMBED_LINKS, USE_EXTERNAL_EMOJIS])) return;
    if(cooldown.has(message.author.id)) {
        message.reply(`Please wait \`5 seconds\` between using the command, because you are on cooldown`)
    } else {


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

    cooldown.add(message.author.id);
    setTimeout(() => {
        cooldown.delete(message.author.id)
    }, 5000); // here will be the time in miliseconds 5 seconds = 5000 miliseconds
    }
}

module.exports.help = {
    name: "ping", // name of the cmd
    aliases: ['ms', 'Ping'],
}