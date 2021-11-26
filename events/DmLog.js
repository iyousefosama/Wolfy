const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    name: 'messageCreate',
    async execute(client, message) {
        if (message.author == client.user) return;
        if (message.author.bot){
            return;
          };
        if (!message.author) return;
        if(message.embeds[0]) return;
        if(message.attachments.size) return;
        if (message.channel.type === 'DM') {
        const timestamp = Math.floor(Date.now() / 1000)
        const dmEmbed = new Discord.MessageEmbed()
        .setAuthor(client.user.username, client.user.displayAvatarURL({dynamic: true, size: 2048}))
        .setTitle('<a:pp659:853495803967307887> New DM')
        .setColor("738ADB")
        .setTimestamp()
        .setDescription(`<:Humans:853495153280155668> **User:** ${message.author.tag} (\`${message.author.id}\`)\n• **At:** <t:${timestamp}>\n\n<a:Right:877975111846731847> **Content**: \`\`\`\n${message.content || '❌ | Unkown message!'}\n\`\`\``)
        .setThumbnail(message.author.displayAvatarURL({dynamic: true}))

        const Debug = await client.channels.cache.get(config.debug)
        const botname = client.user.username;
        setTimeout(async function(){
        const webhooks = await Debug.fetchWebhooks()
        let webhook = webhooks.filter((w)=>w.type === "Incoming" && w.token).first();
        if(!webhook){
          webhook = await Debug.createWebhook(botname, {avatar: client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 128 })})
        } else if(webhooks.size <= 10) {
          // Do no thing...
        }
        webhook.send({ embeds: [dmEmbed] })
        .catch(() => {});
      }, 20000);
      const Debug2 = await client.channels.cache.get(config.debug2)
      setTimeout(async function(){
      const webhooks = await Debug2.fetchWebhooks()
      let webhook = webhooks.filter((w)=>w.type === "Incoming" && w.token).first();
      if(!webhook){
        webhook = await Debug2.createWebhook(botname, {avatar: client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 128 })})
      } else if(webhooks.size <= 10) {
        // Do no thing...
      }
      webhook.send({ embeds: [dmEmbed] })
      .catch(() => {});
    }, 25000);
          // add more functions on ready  event callback function...
        
          return;
    }
}
}