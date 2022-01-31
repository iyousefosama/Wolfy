const discord = require('discord.js')
const fetch = require('node-fetch')
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: "live",
    aliases: ["Live", "yt-together", "youtube-together", "yt"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    group: 'Utilities',
    usage: '',
    description: 'Start new youtube together party',
    cooldown: 60, //seconds(s)
    guarded: false, //or false
    permissions: [],
    clientpermissions: ["USE_EXTERNAL_EMOJIS", "EMBED_LINKS", "CONNECT"],
    examples: [''],
    async execute(client, message, args) {
    let channel = message.member.voice.channel;
    if(!channel) return message.channel.send({ content: "**<a:pp802:768864899543466006> You should be in a `voice channel` to start Youtube together**" })

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
            "Authorization": `Bot ${client.token}`,
            "Content-Type": "application/json"
        }
    })
    
    .then(res => res.json())
    .then(invite => {
        if(!invite.code) return message.channel.send({ content: "<a:pp802:768864899543466006> I can't start youtube together without invite code!" })
        const done = new discord.MessageEmbed()
        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({dynamic: true, size: 2048}) })
        .setTitle("<:pp493:836169029085298698> Youtuber together!")
        .setColor(`RED`)
        .setThumbnail(`https://cdn.discordapp.com/attachments/830926767728492565/844596072473952316/395_Youtube_logo-512.png`)
        .setDescription(`<:Verify:841711383191879690> Successfully choosed the channel, [**click**](https://discord.com/invite/${invite.code}) the button!`)
        .addFields(
            { name: `<:pp499:836168214525509653> Channel:`, value: `<#${channel.id}>`},
        )
        .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({dynamic: true}) })
        .setTimestamp()
        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
        .setStyle('LINK')
        .setEmoji('877975111846731847')
        .setURL(`https://discord.com/invite/${invite.code}`) 
        .setLabel('Click Here!')
        );
        message.channel.send({ embeds: [done], components: [row]})
    })
}
}