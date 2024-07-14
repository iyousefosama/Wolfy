const discord = require('discord.js');
const schema = require('../../schema/GuildSchema')
const { ChannelType } = require('discord.js')

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
    name: "setsuggch",
    aliases: ["setsuggestionchannel", "setsuggestionsch", "setsuggestch"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '<channelID>',
    group: 'setup',
    description: 'Setup the suggestion channel bot will send suggestions from users there!',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    requiresDatabase: true,
    permissions: ["ManageChannels"],
    examples: [
      '877130715337220136'
    ],

  async execute(client, message, args) {
      
          const channelID = args[0];
          channel = message.guild.channels.cache.get(channelID);
      
          if (!channel || channel.type !== ChannelType.GuildText){
            return message.channel.send({ content: `\\❌ **${message.member.displayName}**, please provide a valid channel ID.`});
          } else if (!channel.permissionsFor(message.guild.members.me).has('SEND_MESSAGES')){
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
        if(data.Mod.Suggestion.channel !== null && channel.id == data.Mod.Suggestion.channel) {
          return message.channel.send({ content: `\\❌ **${message.member.displayName}**, Suggestions channel is already set to ${channel}!`});
        }
        data.Mod.Suggestion.channel = channel.id
        data.save()
        .then(() => {
          const embed = new discord.EmbedBuilder()
          .setColor('DarkGreen')
          .setDescription([
            '<a:Correct:812104211386728498>\u2000|\u2000',
            `Successfully set the Suggestions channel to ${channel}!\n\n`,
            !data.Mod.Suggestion.isEnabled ? `\\⚠️ Suggestion cmd is disabled! To enable, type \`${client.prefix}suggtoggle\`\n` :
            `To disable this feature, use the \`${client.prefix}suggtoggle\` command.`
          ].join(''))
          message.channel.send({ embeds: [embed] })
      })
}
}