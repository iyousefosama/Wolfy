const Discord = require('discord.js')
const txtgen = require('txtgen')
const ms = require('ms')
const inGame = new Set()
const schema = require('../../schema/Economy-Schema')

module.exports = {
    name: "fast",
    aliases: ["Fast", "FastTyper", "FASTTYPER", "FAST", "FastTyper"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    group: 'Fun',
    description: 'Start playing fastTyper game',
    cooldown: 15, //seconds(s)
    guarded: false, //or false
    clientpermissions: ["USE_EXTERNAL_EMOJIS", "READ_MESSAGE_HISTORY"],
    examples: [''],
    async execute(client, message, args) {
        let data;
        try{
            data = await schema.findOne({
                userID: message.author.id
            })
            if(!data) {
            data = await schema.create({
                userID: message.author.id
            })
            }
        } catch(err) {
            console.log(err)
        }
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
        message.reply({ content: `Write the following message **(You have 15 seconds!)**:\n${sentence}` })
        try {
            msg = await message.channel.awaitMessages({filter, 
                max: 1,
                time: 15000,
                errors: ['time']
            })
        } catch (ex) {
            var timeE = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setDescription(`<a:pp681:774089750373597185> Time\'s up! <a:pp681:774089750373597185>`)
            var end = message.channel.send({ embeds: [timeE] })
            inGame.delete(message.author.id)
            break
        }
        if (['cancel', 'end', 'End', 'Cancel'].includes(msg.first().content.toLowerCase().trim())) {
            var end = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setDescription(`<a:pp802:768864899543466006> | Ended!`)
            var end = message.channel.send({ embeds: [fail] })
            inGame.delete(message.author.id)
            break
        } else if (msg.first().content.toLowerCase().trim() === ogSentence.toLowerCase()) {
            var gg = new Discord.MessageEmbed()
            .setColor(`DARK_GREEN`)
            .setDescription(`<a:pp102:768869217805140008> **Good job!**\nIt took you \`${ms(Date.now() - time, {long: true})}\` to type it!`)
            var msg = message.channel.send({ embeds: [gg] })
        } else {
            var fail = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setDescription(`<a:Wrong:812104211361693696> | You failed! `)
            var msg = message.channel.send({ embeds: [fail] })
            inGame.delete(message.author.id)
            break
        }

        if (i === 25) {
            let moneyget = Math.floor(Math.random() * 200) + 2;
            data.credits += Math.floor(moneyget);
            await data.save()
            var win = new Discord.MessageEmbed()
            .setColor(`DARK_GREEN`)
            .setDescription(`**GG!** You win the game! <a:pp102:768869217805140008>\n<a:Money:836169035191418951> **${message.author.tag}**, You received **${moneyget}** for winning the game.`)
            var msg = message.channel.send({ embeds: [win] })
            inGame.delete(message.author.id)
            break
        }
    }
    }
}