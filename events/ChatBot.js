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
        if(!Channel) return;
        if(message.channel.id == Channel.id) {
            message.channel.sendTyping()
            const url = 'https://waifu.p.rapidapi.com/v1/waifu';

            const options = {
              method: 'POST',
              headers: {
                'content-type': 'application/json',
                'X-RapidAPI-Key': 'b335761898msh3524b71f87e82dbp1956dfjsn3ad103632169',
                'X-RapidAPI-Host': 'waifu.p.rapidapi.com'
              },
              body: `{"user_id":"${message.author.id}","message":"${message.content}","from_name":"${message.author.username}","to_name":"${client.user.username}","situation":"Wolfy loves ${message.author.username}.","translate_from":"auto","translate_to":"auto"}`
            };
            
            fetch(url, options)
              .then(res => res.json())
              .then(json => message.reply(json.response).catch(() => null))
              .catch(() => message.reply('Sorry, There was an error while executing this command!').catch(() => null));
    }
}
}
