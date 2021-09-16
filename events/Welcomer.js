const Discord = require('discord.js')
const { MessageEmbed} = require('discord.js')
const moment = require("moment");
const schema = require('../schema/GuildSchema')
const modifier = require(`${process.cwd()}/util/modifier`);
const string = require(`${process.cwd()}/util/string`);

module.exports = {
    name: 'guildMemberAdd',
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
        let Channel = client.channels.cache.get(data.greeter.welcome.channel)
        let msg;
        if (!Channel || !data.greeter.welcome.channel){
          return;
        } else if (Channel.type !== 'GUILD_TEXT') {
          return;
        } else if (!data.greeter.welcome.isEnabled){
          return;
        } else if(!Channel.guild.me.permissions.has("SEND_MESSAGES") || !Channel.guild.me.permissions.has("ADMINISTRATOR") || !Channel.guild.me.permissions.has("EMBED_LINKS")) {
          return;
        } else {
          // Do nothing..
        };

        const welcome = data.greeter.welcome;
        const type = welcome.type === 'msg' && !welcome.message ? 'default' : welcome.type;
      
        if (type === 'default'){
            let embed = new MessageEmbed()
            .setColor('DARK_GREEN')
            .setTitle(`${member.user.tag} has joined the server!`)
            .setURL('https://Wolfy.yoyojoe.repl.co')
            .setThumbnail(member.user.displayAvatarURL({format: 'png', dynamic: true}))
            .setDescription(`Hello ${member}, welcome to **${member.guild.name}**!\n\nYou are our **${string.ordinalize(member.guild.memberCount)}** member!`)
            .setFooter(`${member.user.username} (${member.user.id})`)
            .setTimestamp()
            return client.channels.cache.get(data.greeter.welcome.channel).send({ content: `> Hey, welcome ${member} <a:Up:853495519455215627> `, embeds: [embed] });
        };
      
        //if message was text, send the text
         if (type === 'msg'){
          const message = await modifier.modify(data.greeter.welcome.message, member);
          return client.channels.cache.get(data.greeter.welcome.channel).send(message);
       };
      
        //if message was embed
        if (type === 'embed'){
          const message = await modifier.modify(data.greeter.welcome.embed, member);
          const embed = new Discord.MessageEmbed()
          .setColor('DARK_GREEN')
          .setTitle(`${member.user.tag} has joined the server!`)
          .setURL('https://Wolfy.yoyojoe.repl.co')
          .setThumbnail(member.user.displayAvatarURL({format: 'png', dynamic: true}))
          .setDescription(message)
          .setFooter(`${member.user.username} (${member.user.id})`)
          .setTimestamp()
          return client.channels.cache.get(data.greeter.welcome.channel).send({ content: `> Hey, welcome ${member} <a:Up:853495519455215627> `, embeds: [embed]});
       };
    }
}