const discord = require('discord.js');

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    const questions = [
        'What is your name?',
        'How old are you?',
        'What country are you from?',
      ]
      let counter = 0
  
      const filter = (m) => {
        return m.author.id === message.author.id
      }
  
      const collector = new discord.MessageCollector(message.channel, filter, {
        max: questions.length,
        time: 15000 * 3, // 15s
      })
  
      message.channel.send(questions[counter++])
      collector.on('collect', (m) => {
        if (counter < questions.length) {
          m.channel.send(questions[counter++])
        }
      })
  
      collector.on('end', (collected) => {
  
        if (collected.size < questions.length) {
          message.reply('You did not answer the questions in time')
          return
        }
  
        let counter = 0
        collected.forEach((value) => {
          message.channel.send(`🇶 **${questions[counter++]}**\n🅰️${value.content}`)
        })
      })
    }

    

module.exports.help = {
    name: "test",
    aliases: []
}