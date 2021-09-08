const Discord = require('discord.js')
const schema = require('../schema/GuildSchema')

module.exports = {
    name: 'messageDelete',
    async execute(client, message, messageDelete) {
        if (message.channel.type === 'DM') return;
        if (message.author == client) return;
        if (!message.author) return;

        let data;
        try{
            data = await schema.findOne({
                GuildID: message.guild.id
            })
            if(!data) return;
        } catch(err) {
            console.log(err)
        }
        let Channel = client.channels.cache.get(data.LogsChannel)
        if(!Channel) return;
        if(Channel.type !== 'GUILD_TEXT') return;

        const DeletedLog = new Discord.MessageEmbed()
        .setTitle("Deleted Message")
        .setDescription(`**User:** ${message.author.tag}\n**User ID:** ${message.author.id}**\nIn: ${message.channel}**\n**At:** ${new Date()}\n\n**Content:** \`\`\`${message.content || 'I can\'t log embed messages!'}\`\`\`\n`)
        .setColor('RED')
        .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
        const botname = client.user.username;
        const webhooks = await Channel.fetchWebhooks();
        const webhook = webhooks.first();
        if(webhook) {
          await webhook.send({
            embeds: [DeletedLog],
            username: botname,
            avatarURL: client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 128 })
          });
        } else if(!webhook) {
          await Channel?.createWebhook(botname, {
            avatar: client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 128 })
          })
          .then(webhook => Promise.all([webhook.send({ embeds: [DeletedLog] }), webhook]))
        }
          // add more functions on ready  event callback function...
        
          return;
    }
}