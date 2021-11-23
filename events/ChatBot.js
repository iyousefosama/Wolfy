const Discord = require('discord.js')
const fetch = require('node-fetch')

module.exports = {
    name: 'messageCreate',
    execute(client, message) {
        if (message.channel.type === 'DM') return;
        if (message.author == client.user) return;
        if (message.author.bot){
            return;
          };
        if (!message.author) return;
        if(message.embeds[0]) return;
        if(message.attachments.size) return;
        if(message.channel.id === '911566889849876512') {
            message.channel.sendTyping()
            fetch.default(`https://api.monkedev.com/fun/chat?msg=${message.content}&uid=${message.author.id}`)
            .then(res => res.json()).catch(() => null)
            .then(data => {
                message.reply({ content: data.response || 'Sorry, i can\'t reply this message!', allowedMentions: { repliedUser: true }})
            })
            .catch(err => {
                return message.reply({ content: 'Sorry, i can\'t reply this message!', allowedMentions: { repliedUser: true }})
              })
    }
}
}
