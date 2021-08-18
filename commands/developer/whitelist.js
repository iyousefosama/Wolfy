const discord = require('discord.js')
const schema = require('../../schema/user-schema')

module.exports = {
    name: "whitelist",
    aliases: ["Whitelist", "WHITELIST"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<user>',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    OwnerOnly: true,
    clientpermissions: ["USE_EXTERNAL_EMOJIS", "EMBED_LINKS", "VIEW_CHANNEL"],
    async execute(client, message, args) {

    let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username === args.slice(0).join(" ") || x.user.username === args[0])
    if(!user) return message.channel.send("<a:pp802:768864899543466006> **Please mentions a user!**")

    const done = new discord.MessageEmbed()
    .setColor(`GREEN`)
    .setDescription(`<a:pp399:768864799625838604> Successfully whitelisted \`${user.tag}\``)

    let data;
    try {
        data = await schema.findOne({
            userId: user.id
        })
        if(!data) {
            data = await schema.create({
                userId: user.id
            })
        }
    } catch (error) {
        console.log(error)
    }

    data.blacklisted = false
    await data.save()
    return message.channel.send(done)
    }
}