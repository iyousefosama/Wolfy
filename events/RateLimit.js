const Discord = require('discord.js')
let logs = [];

module.exports = {
    name: 'rateLimit',
    async execute(client, info) {
      if (!info){
        return;
      };
      if(!client.config.channels.debug) {
        return;
      } else {
        // Do nothing..
      }


      const Channel = client.channels.cache.get(info.path.replace("/channels/", '').replace("/messages", ''))
      const _id = Math.random().toString(36).slice(-7);
      let output;
      Channel.messages.fetch().then(async (messages) => {
        output = messages.reverse().map(m => `${new Date(m.createdAt).toLocaleString('en-US')} - ${m.author.tag}(${m.author.id}): ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`).join('\n');
      })

      const ratelimit = new Discord.MessageEmbed()
      .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({dynamic: true, size: 2048}) })
      .setColor('RED')
      .setDescription(`\`\`\`js\nRate_limit_hit: ${info.timeDifference ? info.timeDifference : info.timeout ? info.timeout: 'Unknown timeout '}\nLimit: ${info.limit}\nChannel: ${Channel.name}(${Channel.id})\nGuild: ${Channel.guild.name}(${Channel.guild.id})\`\`\``)
      .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({dynamic: true}) })
      .setTimestamp()
      const Debug = await client.channels.cache.get(client.config.channels.debug)
      const botname = client.user.username;
      logs.push(ratelimit)
      setTimeout(async function(){
      const webhooks = await Debug.fetchWebhooks()
      let webhook = webhooks.filter((w)=>w.type === "Incoming" && w.token).first();
      if(!webhook){
        webhook = await Debug.createWebhook(botname, {avatar: client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 128 })})
      } else if(webhooks.size <= 10) {
        // Do no thing...
      }
      webhook.send({content: `RateLimit from **[${Channel.guild.name}](${Channel.guild.iconURL({size: 32})})** - \`#${Channel.name}\`!\r\n\r\n`, embeds: logs.slice(0, 10).map(log => log), files: [{ attachment: Buffer.from(output), name: `Ratelimit-${_id}.txt`}]})
      .catch(() => {})
      logs = []
    }, 5000);
      
        // add more functions on ready  event callback function...
      
        return;
    }
}