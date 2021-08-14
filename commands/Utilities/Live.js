const discord = require('discord.js')
const fetch = require('node-fetch')

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return
    if(!message.guild.me.permissions.has('SEND_MESSAGES', 'EMBED_LINKS', 'USE_EXTERNAL_EMOJIS')) return;
    let channel = message.member.voice.channel;
    if(!channel) return message.channel.send("**<a:pp802:768864899543466006> You should be in a `voice channel` to start Youtube together**")

    fetch(`https://discord.com/api/v8/channels/${channel.id}/invites`, {
        method: "POST",
        body: JSON.stringify({
            max_age: 86400,
            max_uses: 0,
            target_application_id: "755600276941176913",
            target_type: 2,
            temporary: false,
            validate: null
        }),
        headers: {
            "Authorization": `Bot ${Client.token}`,
            "Content-Type": "application/json"
        }
    })
    
    .then(res => res.json())
    .then(invite => {
        if(!invite.code) return message.channel.send("<a:pp802:768864899543466006> I can't start youtube together without invite code!")
        const done = new discord.MessageEmbed()
        .setTitle(`Click here!`)
        .setColor(`f90505`)
        .setThumbnail(`https://cdn.discordapp.com/attachments/830926767728492565/844596072473952316/395_Youtube_logo-512.png`)
        .setDescription(`<:pp493:836169029085298698> Done choosen the channel, click the link above`)
        .setURL(`https://discord.com/invite/${invite.code}`)
        .addFields(
            { name: `Channel:`, value: `<#${channel.id}>`},
        )
        .setFooter(`Requested by: ${message.member.displayName}`, message.member.user.displayAvatarURL())
        .setTimestamp()
        message.channel.send(done)
    })
}

module.exports.help = {
    name: 'yt',
    aliases: ['yt-t', 'Yt', 'Youtube', 'Yt-t', 'live']
}