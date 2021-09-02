const Discord = require('discord.js')
const fetch = require('node-fetch')

module.exports = {
    name: 'messageCreate',
    execute(client, message) {
        if(message.channel.id === '880151543159087184') {
            if (message.author == client.user) return;
            if (message.author.bot){
                return;
              };
            fetch.default(`https://api.monkedev.com/fun/chat?msg=${message.content}&uid=${message.author.id}`)
            .then(res => res.json())
            .then(data => {
                message.channel.sendTyping()
                message.reply({ content: data.response, allowedMentions: { repliedUser: true }})
            })
            .catch(err => {
                message.channel.sendTyping()
                message.reply({ content: 'Sorry, i can\'t reply this message!', allowedMentions: { repliedUser: true }})
              })
    }
}
}
