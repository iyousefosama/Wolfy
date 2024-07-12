const discord = require('discord.js')
const txtgen = require('txtgen')
const ms = require('ms')
const inGame = new Set()
const schema = require('../../schema/Economy-Schema')

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
    name: "fast",
    aliases: ["fastTyper"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    group: 'Fun',
    description: 'Start playing fastTyper game',
    cooldown: 15, //seconds(s)
    guarded: false, //or false
    permissions: [],
    clientPermissions: ["UseExternalEmojis", "ReadMessageHistory"],
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
    for (i = 1; i <= 5; i++) {
        const time = Date.now()
        let sentence = ''
        let ogSentence = txtgen.sentence().toLowerCase().split('.').join('').split(',').join('')
        ogSentence.split(' ').forEach(argument => {
            sentence += '`' + argument.split('').join(' ') + '` '
        })
        message.reply({ content: `Write the following message **(You have 30 seconds!)**:\n${sentence}` })
        try {
            msg = await message.channel.awaitMessages({filter, 
                max: 1,
                time: 30000,
                errors: ['time']
            })
        } catch (ex) {
            var timeE = new discord.EmbedBuilder()
            .setColor(`Red`)
            .setDescription(`<a:pp681:774089750373597185> Time\'s up! <a:pp681:774089750373597185>`)
            var end = message.channel.send({ embeds: [timeE] })
            inGame.delete(message.author.id)
            break
        }
        if (['cancel', 'end', 'End', 'Cancel'].includes(msg.first().content.toLowerCase().trim())) {
            var end = new discord.EmbedBuilder()
            .setColor(`Red`)
            .setDescription(`<a:pp802:768864899543466006> | Ended!`)
            var end = message.channel.send({ embeds: [end] })
            inGame.delete(message.author.id)
            break
        } else if (msg.first().content.toLowerCase().trim() == ogSentence.toLowerCase()) {
            var gg = new discord.EmbedBuilder()
            .setColor(`DarkGreen`)
            .setAuthor({name: `${message.author.tag} Passed Round ${i}!`, iconURL: message.author.displayAvatarURL({dynamic: true})})
            .setDescription(`<a:pp102:768869217805140008> **Good job!**\nIt took you \`${ms(Date.now() - time, {long: true})}\` to type it!`)
            .setFooter({ text: `Your next round will start after 5(s)`, iconURL: message.author.displayAvatarURL({dynamic: true})})
            .setTimestamp()
            var msg = message.channel.send({ embeds: [gg] })
            await new Promise(r=>setTimeout(r,5000))
        } else {
            var fail = new discord.EmbedBuilder()
            .setColor(`Red`)
            .setDescription(`<a:Wrong:812104211361693696> | You failed! `)
            var msg = message.channel.send({ embeds: [fail] })
            inGame.delete(message.author.id)
            break
        }

        if (i === 10) {
            let moneyget = Math.floor(Math.random() * 600) + 150;
            data.credits += Math.floor(moneyget);
            await data.save()
            var win = new discord.EmbedBuilder()
            .setColor(`DarkGreen`)
            .setDescription(`**GG!** You win the game! <a:pp102:768869217805140008>\n<a:Money:836169035191418951> **${message.author.tag}**, You received **${moneyget}** for winning the game.`)
            var msg = message.channel.send({ embeds: [win] })
            inGame.delete(message.author.id)
            break
        }
    }
    }
}