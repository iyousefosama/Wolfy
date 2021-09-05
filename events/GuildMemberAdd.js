const Discord = require('discord.js')
const moment = require("moment");
const config = require('../config.json')

module.exports = {
    name: 'guildMemberAdd',
    execute(client, member) {
        const Add = new Discord.MessageEmbed()
        .setAuthor(member.user.username, member.user.displayAvatarURL({dynamic: true, size: 2048}))
        .setTitle('<a:Up:853495519455215627> Member Join!')
        .setDescription(`<a:iNFO:853495450111967253> MemberTag: ${member.user.tag}\n<:pp198:853494893439352842> MemberID: \`${member.user.id}\`\n<a:Right:877975111846731847> Created At: ${moment.utc(member.user.createdAt).format('LT')} ${moment.utc(member.user.createdAt).format('LL')} (\`${moment.utc(member.user.createdAt).fromNow()}\`)\n<a:Right:877975111846731847> Joined At: ${moment(member.joinedAt).format("LT")} ${moment(member.joinedAt).format('LL')} (\`${moment(member.joinedTimestamp).fromNow()}\`)`)
        .setColor('GREEN')
        .setFooter(member.guild.name, member.guild.iconURL({dynamic: true}))
        .setTimestamp() 
        const botname = client.user.username;
        member.guild.channels.cache.get(config.log)?.createWebhook(botname, {
            avatar: client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 128 })
          })
          .then(webhook => Promise.all([webhook.send({ embeds: [Add] }), webhook]))
          .then(([_, webhook]) => webhook.delete())
          .catch(() => {});
        
          // add more functions on ready  event callback function...
        
          return;
    }
}
