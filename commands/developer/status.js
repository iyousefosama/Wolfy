const discord = require('discord.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "status",
    aliases: ["Status", "STATUS"],
    dmOnly: false, //or false
    guildOnly: false, //or false
    args: true, //or false
    usage: '<type>',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    OwnerOnly: true,
    async execute(client, message, args) {

    const content = args.join(" ")
    const splitt = content.split('');

    const lol = new MessageEmbed()
    .setAuthor(`${client.user.username}`, `${client.user.displayAvatarURL()}`)
    .setDescription(":x: Please enter a status type!")
    .setColor(`#131313`)
    if (!splitt[0]) return message.channel.send({ embeds: [lol] });


        if(content === 'dnd') {
            client.user.setStatus('dnd')
            const sux = new MessageEmbed()
                .setAuthor(`${client.user.username}`, `${client.user.displayAvatarURL()}`)
                .setDescription(":white_check_mark: Status changed to `do not disturb`!")
                .setColor(`#131313`)
                message.channel.send({ embeds: [sux] })
        } else {
            if(content === 'online') {
                client.user.setStatus('online')
                const sux = new MessageEmbed()
                .setAuthor(`${client.user.username}`, `${client.user.displayAvatarURL()}`)
                .setDescription(":white_check_mark: Status changed to `online`!")
                .setColor(`#131313`)
                message.channel.send({ embeds: [sux] })
            } else {
                if(content === 'idle') {
                    client.user.setStatus('idle')
                    const sux = new MessageEmbed()
                .setAuthor(`${client.user.username}`, `${client.user.displayAvatarURL()}`)
                .setDescription(":white_check_mark: Status changed to `idle`!")
                .setColor(`#131313`)
                message.channel.send({ embeds: [sux] })
                } else {
                    if(content != ['dnd', 'online', 'idle']) {
                        const meh = new MessageEmbed()
                        .setAuthor(`${client.user.username}`, `${client.user.displayAvatarURL()}`)
                        .setDescription(`:x: Please enter a **valid** status type!
                        **Options:**
                        dnd (do not disturb)
                        online
                        idle`)
                        .setColor(`#131313`)
                        return message.channel.send({ embeds: [meh] })
                    } 
                
            }
        }
    }
    }
}