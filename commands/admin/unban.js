const discord = require('discord.js');

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    if (message.channel.type === "dm") return;
    const Messingperms = new discord.MessageEmbed()
    .setColor(`RED`)
    .setDescription(`<a:pp802:768864899543466006> You don't have permission to use that command.`)
    if(!message.member.hasPermission('BAN_MEMBERS', 'ADMINISTRATOR')) return message.channel.send(Messingperms)
    if(!message.guild.me.permissions.has('BAN_MEMBERS', 'ADMINISTRATOR')) return;

    const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    let reason = args.slice(1).join(" ")

    if(!reason) reason = 'No reason provided';
    
    const user1 = new discord.MessageEmbed()
    .setColor(`RED`)
    .setDescription(`<a:pp802:768864899543466006> Please provide a ID to unban`)
    const user2 = new discord.MessageEmbed()
    .setColor(`RED`)
    .setDescription(`<a:pp802:768864899543466006> Please provide a valid ID that is numbers`)
    const no = new discord.MessageEmbed()
    .setColor(`RED`)
    .setDescription(`<a:pp802:768864899543466006> No one is banned in this server`)
    const not = new discord.MessageEmbed()
    .setColor(`RED`)
    .setDescription(`<a:pp802:768864899543466006> This user isnt banned!`)
    const wrong1 = new discord.MessageEmbed()
    .setColor(`RED`)
    .setDescription(`<a:pp802:768864899543466006> This user isnt banned!`)
    if(!user) return message.channel.send(user1)
    if(isNaN(user)) return message.channel.send(user2)

    message.guild.fetchBans().then(async bans => {
        if(bans.size === 0) return message.channel.send(no)
        let BannedUser = bans.find(ban => ban.user.id == user)
        if(!BannedUser) return message.channel.send(not)
        await message.guild.members.unban(BannedUser.user, reason).catch(err =>{
            return message.channel.send(wrong1)
        }).then(() => {
            var dn = new discord.MessageEmbed()
            .setColor(`DARK_GREEN`)
            .setDescription(`<a:Correct:812104211386728498> successfully unbanned ${user}`)
            var msg = message.channel.send(dn)
        })
    })
    .catch(err => {
        const UnknownErr = new discord.MessageEmbed()
        .setColor(`RED`)
        .setDescription(`<a:pp802:768864899543466006> Error, please report this to on our support server!`)
        .setURL(`https://discord.gg/qYjus2rujb`)
        message.channel.send(UnknownErr)
        console.error(err);
      })
}

    

module.exports.help = {
    name: "unban",
    aliases: ['']
}