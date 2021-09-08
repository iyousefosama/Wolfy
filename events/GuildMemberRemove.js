const Discord = require('discord.js')
const moment = require("moment");
const schema = require('../schema/GuildSchema')

module.exports = {
    name: 'guildMemberRemove',
    async execute(client, member) {

        let data;
        try{
            data = await schema.findOne({
                GuildID: member.guild.id
            })
            if(!data) return;
        } catch(err) {
            console.log(err)
        }
        let Channel = client.channels.cache.get(data.LogsChannel)
        if(!Channel) return;
        if(Channel.type !== 'GUILD_TEXT') return;

        const remove = new Discord.MessageEmbed()
        .setAuthor(member.user.username, member.user.displayAvatarURL({dynamic: true, size: 2048}))
        .setTitle('<a:Down:853495989796470815> Member Leave!')
        .setDescription(`<a:iNFO:853495450111967253> MemberTag: ${member.user.tag}\n<:pp198:853494893439352842> MemberID: \`${member.user.id}\`\n<a:Right:877975111846731847> Created At: ${moment.utc(member.user.createdAt).format('LT')} ${moment.utc(member.user.createdAt).format('LL')} (\`${moment.utc(member.user.createdAt).fromNow()}\`)\n<a:Right:877975111846731847> Joined At: ${moment(member.joinedAt).format("LT")} ${moment(member.joinedAt).format('LL')} (\`${moment(member.joinedAt).fromNow()}\`)`)
        .setColor('#2F3136')
        .setFooter(member.guild.name, member.guild.iconURL({dynamic: true}))
        .setTimestamp() 
        const botname = client.user.username;
        await Channel?.createWebhook(botname, {
            avatar: client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 128 })
          })
          .then(webhook => Promise.all([webhook.send({ embeds: [remove] }), webhook]))
          .then(([_, webhook]) => webhook.delete())
          .catch(() => {});
        
          // add more functions on ready  event callback function...
        
          return;
    }
}