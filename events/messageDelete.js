const Discord = require('discord.js')
const schema = require('../schema/GuildSchema')

module.exports = {
    name: 'messageDelete',
    async execute(client, message, messageDelete) {
        if (message.channel.type === 'DM') return;
        if (message.author == client) return;
        if (!message.author) return;
        if(message.embeds[0]) return;
        if(message.attachments.size) return;

        let data;
        try{
            data = await schema.findOne({
                GuildID: message.guild.id
            })
            if(!data) return;
        } catch(err) {
            console.log(err)
        }
        let Channel = client.channels.cache.get(data.Mod.Logs.channel)
        if (!Channel || !data.Mod.Logs.channel){
            return;
          } else if (Channel.type !== 'GUILD_TEXT') {
            return;
          } else if (!data.Mod.Logs.isEnabled){
            return;
          } else if(!Channel.guild.me.permissions.has("SEND_MESSAGES") || !Channel.guild.me.permissions.has("ADMINISTRATOR")) {
            return;
          } else {
            // Do nothing..
          };

        const timestamp = Math.floor(Date.now() / 1000)
        const DeletedLog = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true, size: 2048}))
        .setTitle(`<a:Down:853495989796470815> Deleted Message`)
        .setDescription(`<a:iNFO:853495450111967253>  **Member**: \`${message.author.tag}\` (${message.author.id})\n<:pp198:853494893439352842> **In**: ${message.channel}\n• **At**: <t:${timestamp}>\n\n<a:Right:877975111846731847> **Content**: \`\`\`\n${message.content || '❌ | Unkown message!'}\n\`\`\``)
        .setColor('RED')
        .setFooter(message.guild.name, message.guild.iconURL({dynamic: true}))
        .setTimestamp()
        .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
        const botname = client.user.username;
        const webhooks = await Channel.fetchWebhooks()
        setTimeout(async function(){
        let webhook = webhooks.filter((w)=>w.type === "Incoming" && w.token).first();
        if(!webhook){
          webhook = await Channel.createWebhook(botname, {avatar: client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 128 })})
        } else if(webhooks.size <= 10) {
          // Do no thing...
        }
        webhook.send({embeds: [DeletedLog]})
        .catch(() => {});
    }, 5000);
        
          // add more functions on ready  event callback function...
        
          return;
    }
}