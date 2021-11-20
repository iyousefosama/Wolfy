const Discord = require('discord.js')
const fetch = require('node-fetch')

module.exports = {
    name: 'messageCreate',
    execute(client, message) {
        if(message.channel.id === '911566889849876512') {
            if (message.author == client.user) return;
            if (message.author.bot){
                return;
              };
            message.channel.sendTyping()
            fetch.default(`https://api.monkedev.com/fun/chat?msg=${message.content}&uid=${message.author.id}`)
            .then(res => res.json()).catch(() => null)
            .then(data => {
                message.reply({ content: data.response, allowedMentions: { repliedUser: true }})
            }).catch(() => null)
            .catch(err => {

                message.reply({ content: 'Sorry, i can\'t reply this message!', allowedMentions: { repliedUser: true }})
              })
    }
}
}
