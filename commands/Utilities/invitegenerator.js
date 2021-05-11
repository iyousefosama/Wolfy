const Discord = require('discord.js')

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    let time;
    let timeInfo;
    if (args[0] == 'permanent' || args[0] == 'perm') {
        if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('You must have the Administrator permission to make a permanent invite link!')
        time = 0
        timeInfo = 'is permanent!'
    } else {
        time = 86400
        timeInfo = 'will expire in 1 day!'
    }

    message.channel.createInvite({
            unique: true,
            maxAge: time
        })
        .then(invite => {
            const Embed = new Discord.MessageEmbed()
                .setTitle('Invite Link Generated')
                .setDescription('<:yes:759734212223172660> Server invite link: https://discord.gg/' + invite.code)
                .setFooter(`This link ${timeInfo}`)
                .setColor(`RANDOM`)
            message.channel.send(Embed)
        })
        .catch(console.error)
}

    

module.exports.help = {
    name: "invitegenerator",
    aliases: ['invitegenerat']
}