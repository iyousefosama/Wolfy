const discord = require('discord.js');
const { MessageEmbed } = require('discord.js');

module.exports.run = async (client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    if(message.author.bot) return;
    if(message.author.id !== '724580315481243668') return;

    const content = args.join(" ")
    const splitt = content.split('');

    const lol = new MessageEmbed()
    .setAuthor(`${client.user.username}`, `${client.user.displayAvatarURL()}`)
    .setDescription(":x: Please enter a status type!")
    .setColor(`#131313`)
    if (!splitt[0]) return message.channel.send(lol);


        if(content === 'dnd') {
            client.user.setStatus('dnd')
            const sux = new MessageEmbed()
                .setAuthor(`${client.user.username}`, `${client.user.displayAvatarURL()}`)
                .setDescription(":white_check_mark: Status changed to `do not disturb`!")
                .setColor(`#131313`)
                message.channel.send(sux)
        } else {
            if(content === 'online') {
                client.user.setStatus('online')
                const sux = new MessageEmbed()
                .setAuthor(`${client.user.username}`, `${client.user.displayAvatarURL()}`)
                .setDescription(":white_check_mark: Status changed to `online`!")
                .setColor(`#131313`)
                message.channel.send(sux)
            } else {
                if(content === 'idle') {
                    client.user.setStatus('idle')
                    const sux = new MessageEmbed()
                .setAuthor(`${client.user.username}`, `${client.user.displayAvatarURL()}`)
                .setDescription(":white_check_mark: Status changed to `idle`!")
                .setColor(`#131313`)
                message.channel.send(sux)
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
                        return message.channel.send(meh)
                    } 
                
            }
        }
    }

}

    

module.exports.help = {
    name: "status",
    aliases: ['Status']
}
