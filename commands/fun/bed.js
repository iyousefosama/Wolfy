const discord = require('discord.js');
const canvacord = require('canvacord')
const Canvas = require ('canvacord')

module.exports.run = async (client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    let user1 = message.mentions.users.first()
    if (!user1) return message.reply('Invalid User')
    let user2 = message.author
    let avatar1 = user1.displayAvatarURL({format: 'png', dynamic: false})
    let avatar2 = user2.displayAvatarURL({format: 'png', dynamic: false})
    let face = await canvacord.Canvas.bed(avatar2, avatar1)
    let attachment = new discord.MessageAttachment(face, "bed.png");
    return message.channel.send(attachment);

}

    

module.exports.help = {
    name: "bed",
    aliases: ['']
}