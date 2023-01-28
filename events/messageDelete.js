const discord = require('discord.js')
const schema = require('../schema/GuildSchema')
let logs = []
const { AuditLogEvent, ChannelType } = require('discord.js')

module.exports = {
    name: 'messageDelete',
    async execute(client, message) {
        if (message.channel.type === ChannelType.DM) return;
        if (message.author == client) return;
        if (!message.author) return;
        if(message.embeds[0]) return;
        const file = message.attachments.first()?.url;

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
          } else if (Channel.type !== ChannelType.GuildText) {
            return;
          } else if (!data.Mod.Logs.isEnabled){
            return;
          } else if(!Channel.permissionsFor(Channel.guild.members.me).has(discord.PermissionsBitField.Flags.EmbedLinks, discord.PermissionsBitField.Flags.ViewChannel, discord.PermissionsBitField.Flags.ReadMessageHistory, discord.PermissionsBitField.Flags.ViewAuditLog, discord.PermissionsBitField.Flags.SendMessages)) {
            return;
          } else {
            // Do nothing..
          };

          const fetchedLogs = await message.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MessageDelete,
          });
  
          const messagelog = fetchedLogs.entries.first();
          
          if(!messagelog) {
            return;
          } else {
            //Do nothing..
          }
  
          const { executor, target } = messagelog;

          if(messagelog.available && target.id != message.author.id) {
            return;
          } else {
            //Do nothing..
          }

        const timestamp = Math.floor(Date.now() / 1000)
        const Msg = message.toString().substr(0, 500);
        const DeletedLog = new discord.EmbedBuilder()
        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({dynamic: true, size: 2048}) })
        .setTitle(`<a:Down:853495989796470815> Deleted Message`)
        .setDescription(`<a:iNFO:853495450111967253>  **Member**: ${message.author.tag}(\`${message.author.id}\`)\n${executor.id != message.author.id ? `**Moderator**: ${executor.tag}(\`${executor.id}\`)\n` : ''}<:pp198:853494893439352842> **In**: ${message.channel}\n• **At**: <t:${timestamp}>\n\n<a:Right:877975111846731847> **Content**: \`\`\`\n${Msg || '❌ | Unkown message!'}\n\`\`\``)
        .setImage(file)
        .setColor('Red')
        .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({dynamic: true}) })
        .setTimestamp()
        .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
        const botname = client.user.username;
        const webhooks = await Channel.fetchWebhooks()
        logs.push(DeletedLog)
        setTimeout(async function(){
        let webhook = webhooks.filter((w)=>w.token).first();
        if(!webhook){
          webhook = await Channel.createWebhook({ name: botname, avatar: client.user.displayAvatarURL({ extension:'png', dynamic: true, size: 128 })})(botname, {avatar: client.user.displayAvatarURL({ extension:'png', dynamic: true, size: 128 })})
        } else if(webhooks.size <= 10) {
          // Do no thing...
        }
        webhook.send({embeds: logs.slice(0, 10).map(log => log)})
        .catch(() => {})
        logs = [];
    }, 5000);
        
          // add more functions on ready  event callback function...
        
          return;
    }
}