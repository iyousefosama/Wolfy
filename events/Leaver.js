const discord = require('discord.js')
const { EmbedBuilder} = require('discord.js')
const moment = require("moment");
const schema = require('../schema/GuildSchema')
const modifier = require(`${process.cwd()}/util/modifier`);
const string = require(`${process.cwd()}/util/string`);
const { AuditLogEvent, ChannelType } = require('discord.js')

const requiredPermissions = [
  discord.PermissionsBitField.Flags.ViewAuditLog,
  discord.PermissionsBitField.Flags.SendMessages,
  "ViewChannel",
  "ReadMessageHistory",
  "EmbedLinks",
];

const BEV = require("../util/types/baseEvents");

/** @type {BEV.BaseEvent<"guildMemberRemove">} */
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
        let Channel = client.channels.cache.get(data.greeter.leaving.channel)
        let msg;
        if (!Channel || !data.greeter.leaving.channel){
          return;
        } else if (Channel.type !== ChannelType.GuildText) {
          return;
        } else if (!data.greeter.leaving.isEnabled){
          return;
        } else if(!Channel.permissionsFor(Channel.guild.members.me).has(requiredPermissions)) {
          return;
        } else {
          // Do nothing..
        };

        const leave = data.greeter.leaving;
        const type = leave.type === 'msg' && !leave.message ? 'default' : leave.type;
      
        if (type === 'default'){
            let embed = new EmbedBuilder()
            .setColor('Red')
            .setTitle(`👋 ${member.user.tag} has left our server!`)
            .setURL('https://Wolfy.yoyojoe.repl.co')
            .setThumbnail(member.user.displayAvatarURL({extension:'png', dynamic: true}))
            .setDescription(`**GoodBye ${member}**, sorry to see you go!\n\n<a:pp833:853495989796470815> We are back to \`${member.guild.memberCount}\` members!`)
            .setFooter({ text: `${member.user.username} (${member.user.id})` })
            .setTimestamp()
            return client.channels.cache.get(data.greeter.leaving.channel).send({ embeds: [embed] });
        };
      
        //if message was text, send the text
         if (type === 'msg'){
          const message = await modifier.modify(data.greeter.leaving.message, member);
          return client.channels.cache.get(data.greeter.leaving.channel).send(message);
       };
      
        //if message was embed
        if (type === 'embed'){
          const message = await modifier.modify(data.greeter.leaving.embed, member);
          const embed = new discord.EmbedBuilder()
          .setColor('DarkGreen')
          .setTitle(`${member.user.tag} has joined the server!`)
          .setURL('https://Wolfy.yoyojoe.repl.co')
          .setThumbnail(member.user.displayAvatarURL({extension:'png', dynamic: true}))
          .setDescription(message)
          .setFooter({ text: `${member.user.username} (${member.user.id})` })
          .setTimestamp()
          return client.channels.cache.get(data.greeter.leaving.channel).send({ embeds: [embed]});
       };
    }
}