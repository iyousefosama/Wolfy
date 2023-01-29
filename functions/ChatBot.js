const fetch = require('node-fetch')

const { ChannelType } = require('discord.js')
const { OpenAIApi, Configuration } = require("openai")

const config = new Configuration({
    apiKey: "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"
})

const openai = new OpenAIApi(config)

exports.chat = async function (client, message) {

    if (message.channel.type === ChannelType.DM) return;
    if (message.author == client.user) return;
    if (message.author.bot){
        return;
      };
     if(message.author.id == client.user.id) {
      return;
     }
    if (!message.author) return;
    if(message.embeds[0]) return;
    if(message.attachments.size) return;
    const Channel = message.guild.channels.cache.get(client.config.channels.chatbot)
    if(message.channel.id == Channel?.id) {
        message.channel.sendTyping()
        /*
        const url = 'https://waifu.p.rapidapi.com/v1/waifu';

        const options = {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': 'b335761898msh3524b71f87e82dbp1956dfjsn3ad103632169',
            'X-RapidAPI-Host': 'waifu.p.rapidapi.com'
          },
          body: `{"user_id":"${message.author.id}","message":"${message.content}","from_name":"${message.author.username}","to_name":"${client.user.username}","situation":"${client.user.username} and ${message.author.username} talking in discord, ${client.user.username} loves ${message.author.username}, No bad words.","translate_from":"auto","translate_to":"auto"}`
        };
        
        fetch(url, options)
          .then(res => res.json())
          .then(json => message.reply(json.response).catch(() => null))
          .catch(() => message.reply('Sorry, but something went wrong while responding to this message!').catch(() => null));
          */


        let messages = Array.from(await message.channel.messages.fetch({
            limit: 20,
            before: message.id
        }))
        messages = messages.map(m=>m[1])
        messages.unshift(message)

        let users = [...new Set([...messages.map(m=> m.member.displayName), client.user.username])]
    
        let lastUser = users.pop()
    
        let prompt = `The following is a conversation between ${users.join(", ")}, and ${lastUser} in discord. \n\n`

        for (let i = messages.length - 1; i >= 0; i--) {
            const m = messages[i]
            prompt += `${m.member.displayName}: ${m.content}\n`
        }
        prompt += `${client.user.username}:`

    
        const response = await openai.createCompletion({
            prompt,
            model: "text-davinci-003",
            max_tokens: 500,
            stop: ["\n"]
        })
    
        await message.reply(response.data.choices[0].text || "Hmmm")
}

};