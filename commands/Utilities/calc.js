const discord= require('discord.js');
const math = require('math-expression-evaluator');

module.exports = {
    name: "calc",
    aliases: ["Calc"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<equation>',
    group: 'Utilities',
    description: 'Calculates an equation by wolfy',
    cooldown: 3, //seconds(s)
    guarded: false, //or false
    permissions: [],
    clientpermissions: [],
    examples: [],
    async execute(client, message, args) {
        message.channel.sendTyping()
        const question = args.join(" ")

        if(question.length < 1 || !isNaN(question)) {
            return message.channel.send(`\\❌ | ${message.author}, Please provid a valid equation to solve!`)
        } else if (question.length > 650) {
            return message.channel.send(`\\❌ | ${message.author}, This equation is too long!`)
        }

        let answer;
        try {
            answer = math.eval(question);
        } catch(err) {
            return message.channel.send(`\\❌ | ${message.author}, [Math error] \`${err.name}\`!`)
        }

        message.reply({ embeds: [new discord.EmbedBuilder()
        .setColor("#2c2f33")
        .setDescription("\`\`\`" + question +  " = " + answer + "\`\`\`")] })
}
}