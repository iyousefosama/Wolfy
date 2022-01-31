const discord = require('discord.js');

module.exports = {
    name: "unmute",
    aliases: ["Unmute", "UNMUTE"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<user>',
    group: 'Moderation',
    description: 'Unmute someone from texting!',
    cooldown: 2, //seconds(s)
    guarded: false, //or false
    permissions: ["MANAGE_ROLES"],
    clientpermissions: ["MANAGE_ROLES"],
    examples: [
        '@BADGUY',
        '742682490216644619'
      ],
    async execute(client, message, [member = '', ...args]) {

    const owner = await message.guild.fetchOwner()
    const author = message.author

    if (!member.match(/\d{17,19}/)){
        return message.channel.send(`\\❌ | ${message.author}, Please type the id or mention the user to mute.`);
      };
  
      member = await message.guild.members
      .fetch(member.match(/\d{17,19}/)[0])
      .catch(() => null);
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
    if (!member) return message.reply({ embeds: [Err1] })
    if (member.id === client.user.id) return message.reply({ embeds: [Err2] })
    if (member.id === message.author.id) return message.reply({ embeds: [Err3] })
    if (message.member.roles.highest.position <= member.roles.highest.position) return message.reply({ embeds: [Err4] })
    if (!member.roles.cache.find(r => r.name.toLowerCase() === 'muted')) return message.channel.send({ embeds: [Err5] })
//////////////////////////////////////////////////////////////////////////////////////////////////////////

//it reorgnize the unmuted role and the member and add the unmuted and remove the muted role
      let mutedRole = message.guild.roles.cache.find(roles => roles.name === "Muted") // u put the muted role
    if(!mutedRole) 
    return message.reply({ content: "<a:pp681:774089750373597185> | I can't find a \`muted\` role in this server, please create one!"}).then(()=>  message.react("💢")).catch(() => null)
    if(mutedRole) {
        member.roles.remove(mutedRole).catch(() => message.reply({ content: '💢 | I can\'t remove \`mutedRole\` to the user, please check that my role is higher!'}))
       
// it will send this message once the bot unmuted the member
const unmute = new discord.MessageEmbed()
.setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL({dynamic: true, size: 2048}) })
.setDescription(`<:On:841711383284547625> Unmuted the user ${member}!`)
.setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true, size: 2048}))
.setTimestamp()
message.channel.send({ embeds: [unmute] })
    }
}
}