const discord = require('discord.js');

module.exports = {
    name: "unmute",
    aliases: ["Unmute", "UNMUTE"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<user>',
    cooldown: 2, //seconds(s)
    guarded: false, //or false
    permissions: ["MANAGE_ROLES", "ADMINISTRATOR"],
    clientpermissions: ["MANAGE_ROLES", "ADMINISTRATOR"],
    async execute(client, message, args) {
let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username === args.slice(0).join(" ") || x.user.username === args[0])

/////////////////////////////////////////////// Errors /////////////////////////////////////////////
    const Err1 = new discord.MessageEmbed()
    .setDescription('<a:pp802:768864899543466006> Please mention a user!')
    .setColor('RED')
    const Err2 = new discord.MessageEmbed()
    .setDescription('<a:pp802:768864899543466006> You can\'t Unmute me!')
    .setColor('RED')
    const Err3 = new discord.MessageEmbed()
    .setDescription('<a:pp802:768864899543466006> You can\'t Unmute yourself!')
    .setColor('RED')
    const Err4 = new discord.MessageEmbed()
    .setDescription('<a:pp802:768864899543466006> User could not be Unmuted!')
    .setColor('RED')
    const Err5 = new discord.MessageEmbed()
    .setDescription('<a:pp802:768864899543466006> User is already Unmuted!')
    .setColor('RED')
///////////////////////////////////////////////// Errors /////////////////////////////////////////////////
    if (!member) return message.reply(Err1)
    if (member.id === client.user.id) return message.reply(Err2)
    if (member.id === message.author.id) return message.reply(Err3)
    if (message.member.roles.highest.position <= member.roles.highest.position) return message.reply(Err4)
    if (!member.roles.cache.find(r => r.name.toLowerCase() === 'muted')) return message.channel.send(Err5)
//////////////////////////////////////////////////////////////////////////////////////////////////////////

//it reorgnize the unmuted role and the member and add the unmuted and remove the muted role
      let mutedRole = message.guild.roles.cache.find(roles => roles.name === "Muted") // u put the muted role
    if(!mutedRole) 
    return message.channel.send("🙄 I can't find a 'Muted' role in this server, please create one!\n\n\`Tip: make 'Muted' role perms that member can't speak in any channel\`")
    if(mutedRole) {
        member.roles.remove(mutedRole);
       
// it will send this message once the bot unmuted the member
const unmute = new discord.MessageEmbed()
.setDescription(`<:on:759732819437158400> I unmuted ${member}`);


message.channel.send(unmute)
.setTimestamp()
    }
}
}