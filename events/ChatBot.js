const Discord = require('discord.js')
const fetch = require('node-fetch')

module.exports = {
    name: 'message',
    execute(client, message) {
        if(message.channel.id === '859100693365653515') {
            if (message.author == client.user) return;
            if (message.author.bot){
                return;
              };
            message.channel.startTyping()
            fetch.default(`https://api.monkedev.com/fun/chat?msg=${message.content}&uid=${message.author.id}`)
            .then(res => res.json())
            .then(data => {
                message.lineReply(data.response, true);
                message.channel.stopTyping()
            })
            .catch(err => {
                message.lineReply(`Sorry, i can\'t reply this message!`, false);
                message.channel.stopTyping()
              })
    }
}
}
