const discord = require('discord.js')
const { EmbedBuilder} = require('discord.js')
const moment = require("moment");
const schema = require('../schema/GuildSchema')
const modifier = require(`${process.cwd()}/util/modifier`);
const string = require(`${process.cwd()}/util/string`);
const canvacord = require('canvacord')
const { AuditLogEvent, ChannelType } = require('discord.js')

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
        } else if (Channel.type !== ChannelType.GuildText) {
          return;
        } else if (!data.greeter.welcome.isEnabled){
          return;
        } else if(!Channel.permissionsFor(Channel.guild.members.me).has("EMBED_LINKS", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "VIEW_AUDIT_LOG", "SEND_MESSAGES")) {
          return;
        } else {
          // Do nothing..
        };

        const welcome = data.greeter.welcome;
        const type = welcome.type === 'msg' && !welcome.message ? 'default' : welcome.type;

        if (type === 'default'){
            let embed = new EmbedBuilder()
            .setColor('DarkGreen')
            .setTitle(`${member.user.tag} has joined the server!`)
            .setURL('https://Wolfy.yoyojoe.repl.co')
            .setThumbnail(member.user.displayAvatarURL({extension:'png', dynamic: true}))
            .setDescription(`Hello ${member}, welcome to **${member.guild.name}**!\n\nYou are our **${string.ordinalize(member.guild.memberCount)}** member!`)
            .setFooter({ text: `${member.user.username} (${member.user.id})` })
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
          const embed = new discord.EmbedBuilder()
          .setColor('DarkGreen')
          .setTitle(`${member.user.tag} has joined the server!`)
          .setURL('https://Wolfy.yoyojoe.repl.co')
          .setThumbnail(member.user.displayAvatarURL({extension:'png', dynamic: true}))
          .setDescription(message)
          .setFooter({ text: `${member.user.username} (${member.user.id})` })
          .setTimestamp()
          return client.channels.cache.get(data.greeter.welcome.channel).send({ content: `> Hey, welcome ${member} <a:Up:853495519455215627> `, embeds: [embed]});
       };
       if (type === 'image'){
        const WelcomeFile = new canvacord.Welcomer()
        .setMemberCount(member.guild.memberCount)
        .setAvatar(member.displayAvatarURL({extension:"png", size: 1024}))
        .setUsername(member.user.username)
        .setDiscriminator(member.user.discriminator)
        .setGuildName(member.guild.name)
        .setColor("border", "#7289da")
        .setColor("username-box", "#eb403b")
        .setColor("discriminator-box", "#2a2a2b")
        .setColor("message", "#c19a6b")
        .setColor("title", "#e6a54a")
        .setColor("title-border", "#2a2a2b")
        .setColor("background", "#2a2a2b");
        await WelcomeFile.build()
        .then(data => {
            const attachment = new discord.AttachmentBuilder(data, "Welcomer.png");
            return client.channels.cache.get(welcome.channel).send({ content: `> Hey, welcome ${member} <a:Up:853495519455215627> `, files: [attachment]});
        });
       };
    }
}