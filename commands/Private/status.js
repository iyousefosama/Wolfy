const discord = require('discord.js');
const { EmbedBuilder } = require('discord.js');

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
    name: "status",
    aliases: [],
    dmOnly: false, //or false
    guildOnly: false, //or false
    args: true, //or false
    usage: '<type>',
    group: 'developer',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    ownerOnly: true,
    permissions: [],

  async execute(client, message, args) {

    const content = args.join(" ")
    const splitt = content.split('');

    const Missed = new EmbedBuilder()
    .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
    .setDescription(":x: Please enter a status type!")
    .setColor(`#131313`)
    if (!splitt[0]) return message.channel.send({ embeds: [Missed] });


        if(content === 'dnd') {
            client.user.setStatus('dnd')
            const Embed = new EmbedBuilder()
                .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
                .setDescription(":white_check_mark: Status changed to `do not disturb`!")
                .setColor(`#131313`)
                message.channel.send({ embeds: [Embed] })
        } else {
            if(content === 'online') {
                client.user.setStatus('online')
                const Embed = new EmbedBuilder()
                .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
                .setDescription(":white_check_mark: Status changed to `online`!")
                .setColor(`#131313`)
                message.channel.send({ embeds: [Embed] })
            } else {
                if(content === 'idle') {
                    client.user.setStatus('idle')
                    const Embed = new EmbedBuilder()
                .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
                .setDescription(":white_check_mark: Status changed to `idle`!")
                .setColor(`#131313`)
                message.channel.send({ embeds: [Embed] })
                } else {
                    if(content != ['dnd', 'online', 'idle']) {
                        const Nan = new EmbedBuilder()
                        .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
                        .setDescription(`:x: Please enter a **valid** status type!
                        **Options:**
                        dnd (do not disturb)
                        online
                        idle`)
                        .setColor(`#131313`)
                        return message.channel.send({ embeds: [Nan] })
                    } 
                
            }
        }
    }
    }
}