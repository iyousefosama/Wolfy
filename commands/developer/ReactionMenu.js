const { MessageEmbed } = require('discord.js')
const { MessageMenuOption, MessageMenu, MessageActionRow } = require('discord-buttons') // npm i discord-buttons@latest // For Select Menu

module.exports = {
    name: "rm",
    aliases: ["Rm", "RM"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    cooldown: 960, //seconds(s)
    guarded: false, //or false
    async execute(client, message, args) {
    if(message.author.id !== '829819269806030879') return;
    let option = new MessageMenuOption()
    .setLabel('All Annoucments mention')
    .setEmoji('841321889681899540')
    .setValue('DR1')
    .setDescription('Click here to get all Annoucments mentions!')
    let option2 = new MessageMenuOption()
    .setLabel('Free Games Mention')
    .setEmoji('🎁')
    .setValue('DR2')
    .setDescription('Click here to get Free Games Mentions!')
    let option3 = new MessageMenuOption()
    .setLabel('Looking For group mention')
    .setEmoji('845681277922967572')
    .setValue('DR3')
    .setDescription('Click here to get Looking For group mentions!')
    let option4 = new MessageMenuOption()
    .setLabel('Watching party mention')
    .setEmoji('836169046508306432')
    .setValue('DR4')
    .setDescription('Click here to get Watching party mentions!')
    let option5 = new MessageMenuOption()
    .setLabel('Partner mention')
    .setEmoji('840126839754326017')
    .setValue('DR5')
    .setDescription('Click here to get Partner mentions!')
    
let select = new MessageMenu()
    .setID('customid')
    .setPlaceholder('Click here to drop the menu!')
    .addOptions([option, option2, option3, option4, option5])


message.channel.send('<:pp499:836168214525509653> **Choose your roles!**', select);
    }
}