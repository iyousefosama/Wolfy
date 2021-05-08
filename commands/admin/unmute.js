const discord = require('discord.js');

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    if (!message.member.hasPermission('ADMINISTRATOR'))
    var Messingperms = new discord.MessageEmbed()
    .setColor(`RED`)
    .setDescription(`<a:pp802:768864899543466006> You don't have permission to use that command.`)
    message.channel.send(Messingperms)
    if (!message.member.hasPermission('ADMINISTRATOR')) return;
      if(!message.guild.me.permissions.has('ADMINISTRATOR')) return message.channel.send('<a:pp297:768866022081036319> Please Check My Permission <a:pp297:768866022081036319>')
// this code check if the member have the perm to unmute or the bot hv the perm to unmute ppl
    if(!message.member.hasPermission('ADMINISTRATOR')) return;
let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username === args.slice(0).join(" ") || x.user.username === args[0])

//it reorgnize the unmuted role and the member and add the unmuted and remove the muted role
      let mutedRole = message.guild.roles.cache.find(roles => roles.name === "Muted") // u put the muted role
          // If bot didn't find Muted role in the server
    if(!mutedRole) 
    return message.channel.send("🙄 I can't find a 'Muted' role in this server, please create one!\n\n\`Tip: make 'Muted' role perms that member can't speak in any channel\`")
    // If member didn't mention anyone after the cmd 
    if (message.mentions.users.size < 1)
      return message
        .reply("**Invalid command usage, try using it like:** \`mute [member] (optional reason)\`")

    if(mutedRole) {
        member.roles.remove(mutedRole);
       
// it will send this message once the bot unmuted the member
const unmute = new discord.MessageEmbed()
.setDescription(`<:on:759732819437158400> I unmuted ${member}`);


message.channel.send(unmute);
    }

}

module.exports.help = {
    name: `unmute`,
    aliases: ['Unmute']
};