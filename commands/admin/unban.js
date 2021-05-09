const discord = require('discord.js');

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    const Messingperms = new discord.MessageEmbed()
    .setColor(`RED`)
    .setDescription(`<a:pp802:768864899543466006> You don't have permission to use that command.`)
    if(!message.member.hasPermission('BAN_MEMBERS', 'ADMINISTRATOR')) return message.channel.send(Messingperms)
    if(!message.guild.me.permissions.has('BAN_MEMBERS', 'ADMINISTRATOR')) return;

    const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    let reason = args.slice(1).join(" ")

    if(!reason) reason = 'No reason provided';
    if(!user) return message.channel.send('Please provide a ID to unban')
    if(isNaN(user)) return message.channel.send("Please provide a valid ID that is numbers")

    message.guild.fetchBans().then(async bans => {
        if(bans.size === 0) return message.channel.send("No one is banned in this server")
        let BannedUser = bans.find(ban => ban.user.id == user)
        if(!BannedUser) return message.channel.send('This user isnt banned!')
        await message.guild.members.unban(BannedUser.user, reason).catch(err =>{
            return message.channel.send("Something went wrong!")
        }).then(() => {
            message.channel.send(`successfully unbanned ${user}`)
        })
    })
}

    

module.exports.help = {
    name: "unban",
    aliases: ['']
}