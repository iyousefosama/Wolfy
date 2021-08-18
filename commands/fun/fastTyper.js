const Discord = require('discord.js')
const txtgen = require('txtgen')
const ms = require('ms')
const inGame = new Set()

module.exports = {
    name: "fast",
    aliases: ["Fast", "FastTyper", "FASTTYPER", "FAST", "FastTyper"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    cooldown: 15, //seconds(s)
    guarded: false, //or false
    clientpermissions: ["USE_EXTERNAL_EMOJIS"],
    async execute(client, message, args) {
    const filter = m => m.author.id === message.author.id
    if (inGame.has(message.author.id)) return
    inGame.add(message.author.id)
    for (i = 0; i < 25; i++) {
        const time = Date.now()
        let sentence = ''
        let ogSentence = txtgen.sentence().toLowerCase().split('.').join('').split(',').join('')
        ogSentence.split(' ').forEach(argument => {
            sentence += '`' + argument.split('').join(' ') + '` '
        })
        message.reply(`Write the following message **(You have 15 seconds!)**:\n${sentence}`)
        try {
            msg = await message.channel.awaitMessages(filter, {
                max: 1,
                time: 15000,
                errors: ['time']
            })
        } catch (ex) {
            var timeE = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setDescription(`<a:pp681:774089750373597185> Time\'s up! <a:pp681:774089750373597185>`)
            var end = message.channel.send(timeE)
            inGame.delete(message.author.id)
            break
        }
        if (['cancel', 'end', 'End', 'Cancel'].includes(msg.first().content.toLowerCase().trim())) {
            var end = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setDescription(`<a:pp802:768864899543466006> **Ended!**`)
            var end = message.channel.send(fail)
            inGame.delete(message.author.id)
            break
        } else if (msg.first().content.toLowerCase().trim() === ogSentence.toLowerCase()) {
            var gg = new Discord.MessageEmbed()
            .setColor(`DARK_GREEN`)
            .setDescription(`<a:pp102:768869217805140008> **Good job!**\nIt took you **${ms(Date.now() - time, {long: true})}** to type it!`)
            var msg = message.channel.send(gg)
        } else {
            var fail = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setDescription(`<a:Wrong:812104211361693696> **You failed!** <a:Wrong:812104211361693696>!`)
            var msg = message.channel.send(fail)
            inGame.delete(message.author.id)
            break
        }

        if (i === 25) {
            var win = new Discord.MessageEmbed()
            .setColor(`DARK_GREEN`)
            .setDescription(`**GG!** You win the game! <a:pp102:768869217805140008>`)
            var msg = message.channel.send(win)
            inGame.delete(message.author.id)
            break
        }
    }
    }
}