const discord = require('discord.js');

module.exports = {
    name: "unban",
    aliases: ["Unban", "UNBAN"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<user>',
    cooldown: 1, //seconds(s)
    guarded: false, //or false
    permissions: ["BAN_MEMBERS", "ADMINISTRATOR"],
    clientpermissions: ["BAN_MEMBERS", "ADMINISTRATOR"],
    async execute(client, message, args) {

    const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username === args.slice(0).join(" ") || x.user.username === args[0])
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
    if(!user) return message.channel.send({ embeds: [user1] })
    if(isNaN(user)) return message.channel.send({ embeds: [user2] })

    message.guild.fetchBans().then(async bans => {
        if(bans.size === 0) return message.channel.send({ embeds: [no] })
        let BannedUser = bans.find(ban => ban.user.id == user)
        if(!BannedUser) return message.channel.send({ embeds: [not] })
        await message.guild.members.unban(BannedUser.user, reason).catch(err =>{
            return message.channel.send({ embeds: [wrong1] })
        }).then(() => {
            var dn = new discord.MessageEmbed()
            .setColor(`DARK_GREEN`)
            .setDescription(`<a:Correct:812104211386728498> successfully unbanned ${user}`)
            var msg = message.channel.send({ embeds: [dn] })
        })
    })
    .catch(err => {
        const UnknownErr = new discord.MessageEmbed()
        .setColor(`RED`)
        .setDescription(`<a:pp802:768864899543466006> Error, please report this with \`w!feedback\`!`)
        message.channel.send({ embeds: [UnknownErr] })
        console.error(err);
      })
}
}