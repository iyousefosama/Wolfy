const discord = require('discord.js')
const schema = require('../../schema/user-schema')

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return
    if(message.author.id !== '829819269806030879') return

    let user = message.mentions.users.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username === args.slice(0).join(" ") || x.user.username === args[0]);
    if(!user) return message.channel.send("<a:pp802:768864899543466006> **Please mentions a user!**")

    const done = new discord.MessageEmbed()
    .setColor(`RED`)
    .setDescription(`<a:pp399:768864799625838604> Successfully blacklisted \`${user.tag}\``)

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

    data.blacklisted = true
    await data.save()
    return message.channel.send(done)

}

module.exports.help = {
    name: 'blacklist',
    aliases: []
}