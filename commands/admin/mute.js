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
// this code check if the member have the perm to mute or the bot hv the perm to mute ppl
    if(!message.member.hasPermission('ADMINISTRATOR')) return;
let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username === args.slice(0).join(" ") || x.user.username === args[0])
//it reorgnize the muted role and the member and add the muted and remove the member role
    let mutedRole = message.guild.roles.cache.find(roles => roles.name === "Muted")
    // If bot didn't find Muted role in the server
    if(!mutedRole) 
    return message.channel.send("🙄 I can't find a 'Muted' role in this server, please create one!\n\n\`Note: make 'Muted' role perms that member can't speak in any channel\`")
    // If member didn't mention anyone after the cmd 
    if (message.mentions.users.size < 1)
      return message
        .reply(`**Invalid command usage, try using it like:** \`${prefix}mute [member] (optional reason)\``)

    if(mutedRole) {
      
        member.roles.add(mutedRole);
// it will send this message once the bot mute the member
const mute = new discord.MessageEmbed()
.setDescription(`<:off:759732760562368534> I muted ${member} from texting`);

message.channel.send(mute);
    }

}

module.exports.help = {
    name: `mute`,
    aliases: ['Mute']
};