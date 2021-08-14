const Discord = require('discord.js')
const { MessageActionRow, MessageButton } = require('discord-buttons')

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    if(!message.guild.me.permissions.has('SEND_MESSAGES')) return;
    const button = new MessageButton()
    .setLabel(`<:Bot:841711382739157043> AddBot`)
    .setID("1")
    .setStyle('url')
    .setURL(`https://discord.com/api/oauth2/authorize?client_id=${Client.id}&permissions=8&scope=bot%20applications.commands`) 
    const button2 = new MessageButton()
    .setLabel(`<a:pp90:853496126153031710> Bot Website`)
    .setID("2")
    .setStyle('url')
    .setURL('https://wolfy.yoyojoe.repl.co/index.html') 
    const button3 = new MessageButton()
    .setLabel(`<:Developer:841321892060201021> Support`)
    .setID("3")
    .setStyle('url')
    .setURL('https://discord.gg/qYjus2rujb') 
    const button4 = new MessageButton()
    .setLabel(`<:pp621:853494405892931644> Youtube`)
    .setID("4")
    .setStyle('url')
    .setURL('https://www.youtube.com/channel/UCWoSOegH2nYnng-B4CknXjA') 

    const row = new Discord.MessageEmbed()
    .addComponents(button, button2, button3, button4)

    const embed = new Discord.MessageEmbed()
    .setTitle(`Hey ${message.author.username}, here you can find all bot link below! <a:pp833:853495989796470815>`)
    .setURL('https://Wolfy.yoyojoe.repl.co')
    .setAuthor(Client.user.username, Client.user.displayAvatarURL())

    const msg = await message.channel.send({embed : embed, components : row})

    
    const filter = async (button) => {
            if(button.id === '1'){
                if (button.clicker.id !== message.author.id) return button.reply.defer()
                }
                if(button.id === '2'){
                    if (button.clicker.id !== message.author.id) return button.reply.defer()
                }
                if(button.id === '3'){
                    if (button.clicker.id !== message.author.id) return button.reply.defer()
                }
                if(button.id === '4'){
                    if (button.clicker.id !== message.author.id) return button.reply.defer()
                }
                if(button.id === '5'){
                    if (button.clicker.id !== message.author.id) return button.reply.defer()
            }
    }
    const collector = msg.createButtonCollector(filter, { time: 30000 }); 
    collector.on('end', message => {
        button.setDisabled(true)
        button2.setDisabled(true)
        button3.setDisabled(true)
        button4.setDisabled(true)
        button5.setDisabled(true)
        const newrow = new MessageActionRow()
        .addComponents(button, button2, button3, button4);
        msg.edit({embed : embed, components : newrow})
    })
}

    

module.exports.help = {
    name: "invite",
    aliases: ['Invite', 'support']
}