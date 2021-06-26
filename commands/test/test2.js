const discord = require('discord.js');

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    const questions = [
        'يرجا كتابه الكميه المطلوبه!',
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
          message.reply(`**تم انشاء طلبك يرجا الانتظار**`)
  
        if (collected.size < questions.length) {
          message.reply('لم يتم الاجابه بالوقت المحدد')
          return
        }
  
        let counter = 0
        collected.forEach((value) => {
            var dn = new discord.MessageEmbed()
            .setColor(`DARK_GREEN`)
            .setTitle(`تم انشاء طلب جديد`)
            .addFields(
                { name: 'النوع', value: `\`\`\`SFA MINECRAFT ACCOUNTS\`\`\``, inline: true},
                { name: 'مطلوب من', value: `\`\`\`${message.author.username}\`\`\``, inline: true},
                { name: 'الكميه المطلوبه', value: `\`\`\`${value.content}\`\`\``, inline: true}
            )
            var msg = message.channel.send(dn)
          .then(channel => {
            message.channel.setName(`SFA-${value.content}`)
          })
        })
      })
    }

    

module.exports.help = {
    name: "buy-sfa",
    aliases: []
}