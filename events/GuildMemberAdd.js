const Discord = require('discord.js')
const moment = require("moment");
const schema = require('../schema/GuildSchema')
const MuteSchema = require('.././schema/Mute-Schema')
let logs = [];

module.exports = {
    name: 'guildMemberAdd',
    async execute(client, member) {

        let data;
        let mutedata;
        try{
            data = await schema.findOne({
                GuildID: member.guild.id
            })
            mutedata = await MuteSchema.findOne({
              guildId: member.guild.id,
              userId: member.id
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
        } else if(!Channel.guild.me.permissions.has("EMBED_LINKS", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "VIEW_AUDIT_LOG", "SEND_MESSAGES")) {
          return;
        } else {
          // Do nothing..
        };

        if(mutedata?.Muted == true) {
          let mutedRole = member.guild.roles?.cache.find(roles => roles.name === "Muted")
          member.roles.add(mutedRole, `Wolfy AUTOMUTE`).catch(() => null)
        }
        
        const Add = new Discord.MessageEmbed()
        .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL({dynamic: true, size: 2048}) })
        .setTitle('<a:Up:853495519455215627> Member Join!')
        .setDescription(`<a:iNFO:853495450111967253> **MemberTag:** ${member.user.tag}\n<:pp198:853494893439352842> **MemberID:** \`${member.user.id}\`\n<a:Right:877975111846731847> **Created At:** ${moment.utc(member.user.createdAt).format('LT')} ${moment.utc(member.user.createdAt).format('LL')} (\`${moment.utc(member.user.createdAt).fromNow()}\`)\n<a:Right:877975111846731847> **Joined At:** ${moment(member.joinedAt).format("LT")} ${moment(member.joinedAt).format('LL')}`)
        .setColor('GREEN')
        .setFooter({ text: member.guild.name, iconURL: member.guild.iconURL({dynamic: true}) })
        .setTimestamp()
        const botname = client.user.username;
        const webhooks = await Channel.fetchWebhooks()
        logs.push(Add)
        setTimeout(async function(){
        let webhook = webhooks.filter((w)=>w.type === "Incoming" && w.token).first();
        if(!webhook){
          webhook = await Channel.createWebhook(botname, {avatar: client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 128 })})
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