const discord = require('discord.js')
const math = require('mathjs')

module.exports.run = async (Client, message, args, prefix) => {

    if(!message.content.startsWith(prefix)) return;

    var question = args.join(' ') // =calc 1 + 1

    if(question.length > 100) return message.channel.send('Sorry you can\`t type more than 100 numbers!')
    if(!question) return message.reply('Please provide a maths equation!')

    let result;
    try {
        result = math.evaluate(question);
        const calc = new discord.MessageEmbed()
        .setColor(`DARK_GREEN`)
        .setTitle(`> **Here is your answer! •** [ ${message.member.user.tag} ] <a:pp399:768864799625838604>`)
        .setDescription(`\`\`\`${question} = ${result}\`\`\``)
        .setFooter(`Calculated at`)
        .setTimestamp()
        message.channel.send(calc)
    } catch (e) {
        var Error = new discord.MessageEmbed()
        .setColor(`RED`)
        .setDescription(`<a:pp802:768864899543466006> Please provide a valid equation!`)
        message.channel.send(Error)
    }
}

module.exports.help = {
    name: `calculate`,
    aliases: ["calc"]
};