const discord = require('discord.js')
const { ChannelType } = require('discord.js')
let logs = []

const BEV = require("../util/types/baseEvents");

/** @type {BEV.BaseEvent<"messageCreate">} */
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
        if (message.channel.type === ChannelType.DM) {
          
        const timestamp = Math.floor(Date.now() / 1000)
        const msg = message.content.toString().substr(0, 500);
        const dmEmbed = new discord.EmbedBuilder()
        .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({dynamic: true, size: 2048}) })
        .setTitle('<a:pp659:853495803967307887> New DM')
        .setColor("738ADB")
        .setTimestamp()
        .setDescription(`<:Humans:853495153280155668> **User:** ${message.author.tag} (\`${message.author.id}\`)\n• **At:** <t:${timestamp}>\n\n<a:Right:877975111846731847> **Content**: \`\`\`\n${msg || '❌ | Unkown message!'}\n\`\`\``)
        .setThumbnail(message.author.displayAvatarURL({dynamic: true}))

        const Debug = await client.channels.cache.get(client.config.channels.debug) || await client.channels.cache.get("877130715337220136");
        const botname = client.user.username;
        logs.push(dmEmbed)
        setTimeout(async function(){
        const webhooks = await Debug.fetchWebhooks()
        let webhook = webhooks.filter((w)=>w.token).first();
        if(!webhook){
          webhook = await Debug.createWebhook({ name: botname, avatar: client.user.displayAvatarURL({ extension:'png', dynamic: true, size: 128 })})
        } else if(webhooks.size <= 10) {
          // Do no thing...
        }
        while (logs.length > 0) {
          webhook.send({ embeds: logs.slice(0, 10) }).catch(() => {});
          logs = logs.slice(10); // Remove the sent embeds from the logs
        }
      }, 10000);
          // add more functions on ready  event callback function...
        
          return;
    }
}
}