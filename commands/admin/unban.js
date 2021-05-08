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


    var guild = message.guild
    let search = args[0];



    if(!search) return message.channel.send("Please provide a valid ID or name.");

    try {
        let bans = await message.guild.fetchBans();
        const banned = await bans.find(b => b.user.id === search)
       
        if(!banned) return message.channel.send("I could not find a banned user by this ID or name.");

        await guild.members.unban(banned.user);

        message.channel.send(`${banned.user} has been unbanned.`);
    } catch(e) {
        message.channel.send(`Unban failed: ${e.message}`)
    }

}

    

module.exports.help = {
    name: "unban",
    aliases: ['']
}