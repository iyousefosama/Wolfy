const { MessageEmbed } = require('discord.js')
const { MessageMenuOption, MessageMenu, MessageActionRow } = require('discord-buttons') // npm i discord-buttons@latest // For Select Menu

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    if(message.author.id !== '829819269806030879') return;
    let option = new MessageMenuOption()
    .setLabel('Server Support')
    .setEmoji('841321889681899540')
    .setValue('SS1')
    .setDescription('Click here for server support!')
    let option2 = new MessageMenuOption()
    .setLabel('Bot support')
    .setEmoji('🎁')
    .setValue('BS2')
    .setDescription('Click here to for bot support!')
    
let select = new MessageMenu()
    .setID('customid45')
    .setPlaceholder('Click here to drop the menu!')
    .addOptions([option, option2])


message.channel.send('<:pp499:836168214525509653> **Choose the support type!**', select);
}

    

module.exports.help = {
    name: "sp",
    aliases: ['Sp']
}