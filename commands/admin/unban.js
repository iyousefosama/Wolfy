const discord = require('discord.js');

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    if(!message.member.hasPermission('BAN_MEMBERS', 'ADMINISTRATOR'))
    // if someone dont hv perm it will send this message
    var Messingperms = new discord.MessageEmbed()
    .setColor(`RED`)
    .setDescription(`<a:pp802:768864899543466006> You don't have permission to use that command.`)
    message.channel.send(Messingperms)
    if(!message.member.hasPermission('BAN_MEMBERS', 'ADMINISTRATOR')) return;
    if(!message.guild.me.permissions.has('BAN_MEMBERS', 'ADMINISTRATOR')) return message.channel.send('<a:pp297:768866022081036319> Please Check My Permission <a:pp297:768866022081036319>')

    let reason = args.slice(1).join(" ")
    let userId = args[0]

    if(!reason) reason = 'No reason provided';
    if(!userId) return message.channel.send('Please provide a ID to unban')
    if(isNaN(userId)) return message.channel.send("Please provide a valid ID that is numbers")

    message.guild.fetchBans().then(async bans => {
        if(bans.size === 0) return message.channel.send("No one is banned in this server")
        let BannedUser = bans.find(ban => ban.user.id == userId)
        if(!BannedUser) return message.channel.send('This user isnt banned!')
        await message.guild.members.unban(BannedUser.user, reason).catch(err =>{
            return message.channel.send("Something went wrong!")
        }).then(() => {
            message.channel.send(`successfully unbanned ${userId}`)
        })
    })
}

    

module.exports.help = {
    name: "unban",
    aliases: ['']
}