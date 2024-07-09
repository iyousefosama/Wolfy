const discord = require('discord.js')

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
    name: "devmsg",
    aliases: ["Devmsg", "DEVMSG", "msg"],
    dmOnly: false, //or false
    guildOnly: false, //or false
    args: true, //or false
    usage: '<user> <message>',
    group: 'developer',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    OwnerOnly: true,
    permissions: [],
    clientPermissions: ["EmbedLinks", "AttachFiles"],
    
    async execute(client, message, [user='', ...args]) {

        user = await client.users
        .fetch(user.match(/\d{17,19}/)[0])
        .catch(() => null);
    
        if (!user){
          return message.channel.send({ content: `<a:Wrong:812104211361693696> | ${message.author}, User could not be found! Please ensure the supplied ID is valid.`});
        };

        const dm = args.slice(1).join(" ")
        if(!dm) return message.channel.send({ content: `<a:Wrong:812104211361693696> | ${message.author}, I can't dm an empty message` })

        const dmembed = new discord.EmbedBuilder()
        .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({dynamic: true}) })
        .setTitle(`__Hey, ${user.username} you have a new message from bot developer__ <a:pp659:853495803967307887>`)
        .setURL(client.config.websites["website"])
        .setDescription(dm)
        .setFooter({ text: `\©️${new Date().getFullYear()} WOLFY`, iconURL: client.user.displayAvatarURL({ dyanmic: true }) })
        .setTimestamp()
        .setImage(`https://cdn.discordapp.com/attachments/830926767728492565/874777015058858044/unnamed_2.png`)
        return await user.send({ embeds: [dmembed] }).then(() => {
            const done = new discord.EmbedBuilder()
            .setColor(`Green`)
            .setDescription(`<a:pp399:768864799625838604> Successfully DM the user ${user}`)
            message.channel.send({ embeds: [done] })
        }).catch(() => message.channel.send({ embeds: [new discord.EmbedBuilder()
            .setColor(`Red`)
            .setDescription(`<a:pp802:768864899543466006> I can't send messages to ${user}`)] })
        )
}
}