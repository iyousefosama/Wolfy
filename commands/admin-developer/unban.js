const discord = require('discord.js');

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(`w@`)) return;
    if(message.author.id !== '829819269806030879') return
    if (message.channel.type === "dm") return;
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
            var dn = new discord.MessageEmbed()
            .setColor(`DARK_GREEN`)
            .setDescription(`<a:Correct:812104211386728498> successfully unbanned ${user}`)
            var msg = message.channel.send(dn)
        })
    })
}

    

module.exports.help = {
    name: "unban",
    aliases: ['']
}