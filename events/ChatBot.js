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
        const Channel = message.guild.channels.cache.get("911566889849876512")
        const Channel2 = message.guild.channels.cache.get("985535881660227654")
        if(message.channel.id == Channel?.id || message.channel.id == Channel2?.id) {
            message.channel.sendTyping().then(setTimeout(async () => {
            const url = 'https://waifu.p.rapidapi.com/v1/waifu';

            const options = {
              method: 'POST',
              headers: {
                'content-type': 'application/json',
                'X-RapidAPI-Key': 'f89e968f93msh68f7a95ca0c5119p175720jsnbe7d03e7d5f0',
                'X-RapidAPI-Host': 'waifu.p.rapidapi.com'
              },
              body: `{"user_id":"${message.author.id}","message":"${message.content}","from_name":"${message.author.username}","to_name":"${client.user.username}","situation":"Wolfy loves ${message.author.username}.","translate_from":"auto","translate_to":"auto"}`
            };
            
            fetch(url, options)
              .then(res => res.json())
              .then(json => message.reply(json.response).catch(() => null))
              .catch(() => message.reply('Sorry, There was an error while executing this command!').catch(() => null));
            }, 2000));
    }
}
}
