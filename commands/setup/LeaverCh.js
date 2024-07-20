const discord = require('discord.js');
const schema = require('../../schema/GuildSchema')
const { ChannelType } = require('discord.js')

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
    name: "setleaverch",
    aliases: ["setleaverchannel", "setleavech", "setleave"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '<channelID>',
    group: 'setup',
    description: 'Setup the leave channel bot will send message when user leave there!',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    requiresDatabase: true,
    permissions: ["ManageChannels", "Administrator"],
    examples: [
      '877130715337220136'
    ],

  async execute(client, message, args) {
      
          const channelID = args[0];
          channel = message.guild.channels.cache.get(channelID);
      
          if (!channel || channel.type !== ChannelType.GuildText){
            return message.channel.send({ content: `\\❌ **${message.member.displayName}**, please provide a valid channel ID.`});
          } else if (!channel.permissionsFor(message.guild.members.me).has('SendMessages')){
            return message.channel.send({ content: `\\❌ **${message.member.displayName}**, I need you to give me permission to send messages on ${channel} and try again.`});
          } else if (!channel.permissionsFor(message.guild.members.me).has("EmbedLinks")){
            return message.channel.send({ content: `\\❌ **${message.member.displayName}**, I need you to give me permission to embed links on ${channel} and try again.`});
          };
          
        let data;
        try{
            data = await schema.findOne({
                GuildID: message.guild.id
            })
            if(!data) {
            data = await schema.create({
                GuildID: message.guild.id
            })
            }
        } catch(err) {
            console.log(err)
            message.channel.send({ content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`})
        }
        data.greeter.leaving.channel = channel.id
        data.save()
        .then(() => {
          const embed = new discord.EmbedBuilder()
          .setColor('DarkGreen')
          .setDescription([
            '<a:Correct:812104211386728498>\u2000|\u2000',
            `Successfully set the leave channel to ${channel}!\n\n`,
            !data.greeter.leaving.isEnabled ? `\\⚠️ Leavermsg is disabled! To enable, type \`${client.prefix}leavertoggle\`\n` :
            `To disable this feature, use the \`${client.prefix}leavertoggle\` command.`
          ].join(''))
          message.channel.send({ embeds: [embed] })
      })
}
}