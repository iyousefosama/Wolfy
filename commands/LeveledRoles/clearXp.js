const discord = require('discord.js')
const canvacord = require('canvacord')
const Levels = require('discord-xp')
const cooldown = new Set();

module.exports = {
    name: "clearxp",
    aliases: ["Clearxp", "ClearXp", "CLEARXP"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<user>',
    cooldown: 3, //seconds(s)
    guarded: false, //or false
    permissions: ["ADMINISTRATOR"],
    clientpermissions: ["ADMINISTRATOR"],
    async execute(client, message, args) {
        const usererr = new discord.MessageEmbed()
        .setDescription('<a:pp802:768864899543466006> Please mention the user to clearXp')
        .setColor("RED")
        .setTimestamp()
        const err = new discord.MessageEmbed()
        .setDescription('<a:pp802:768864899543466006> Error, you can clearXp for this user!')
        .setColor("RED")
        .setTimestamp()
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username === args.slice(0).join(" ") || x.user.username === args[0])
        if (!user) return message.channel.send(usererr)
        Levels.deleteUser(user.id || user, message.guild.id);
        const dn = new discord.MessageEmbed()
        .setDescription(`<a:Correct:812104211386728498> Done, i cleared **xp** for ${user}!`)
        .setColor("DARK_GREEN")
        .setTimestamp()
        message.channel.send(dn)
        .catch(err => {
            message.channel.send(err)
        })
    }
}