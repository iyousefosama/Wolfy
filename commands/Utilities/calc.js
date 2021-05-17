const discord = require('discord.js')
const math = require('mathjs')

module.exports.run = async (Client, message, args, prefix) => {

    if(!message.content.startsWith(prefix)) return;

    var question = args.join(' ') // =calc 1 + 1

    if(question.length > 100) return message.channel.send('Sorry you can\`t type more than 100 numbers!')
    if(!question) return message.channel.send('please provide a maths equation')

    let result;
    try {
        result = math.evaluate(question);


    } catch (e) {
        return message.channel.send('please provide a valid equation') // =calc blblal so it will send this
    }

    var calc = new discord.MessageEmbed()
    .setDescription(`${question} = ${result}`)
    message.channel.send(calc)
}




module.exports.help = {
    name: `calculate`,
    aliases: ["calc"]
};