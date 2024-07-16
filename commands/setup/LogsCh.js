const discord = require('discord.js');
const schema = require('../../schema/GuildSchema')
const { ChannelType } = require('discord.js')

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
  name: "setlogsch",
  aliases: ["setlogschannel", "setlog"],
  dmOnly: false, //or false
  guildOnly: true, //or false
  args: false, //or false
  usage: '<channelID>',
  group: 'setup',
  description: 'Setup the logs channel bot will send logs there!',
  cooldown: 5, //seconds(s)
  guarded: false, //or false
  requiresDatabase: true,
  permissions: ["ManageChannels", "ViewChannel", "Administrator"],
  examples: [
    '877130715337220136'
  ],

  async execute(client, message, args) {

    const channelID = args[0];
    channel = message.guild.channels.cache.get(channelID);

    if (!channel || channel.type !== ChannelType.GuildText) {
      return message.channel.send(`\\❌ **${message.member.displayName}**, please provide a valid channel ID.`);
    } else if (!channel.permissionsFor(message.guild.members.me).has('SEND_MESSAGES')) {
      return message.channel.send(`\\❌ **${message.member.displayName}**, I need you to give me permission to send messages on ${channel} and try again.`);
    } else if (!channel.permissionsFor(message.guild.members.me).has("EmbedLinks")) {
      return message.channel.send(`\\❌ **${message.member.displayName}**, I need you to give me permission to embed links on ${channel} and try again.`);
    };

    let data;
    try {
      data = await schema.findOne({
        GuildID: message.guild.id
      })
      if (!data) {
        data = await schema.create({
          GuildID: message.guild.id
        })
      }
    } catch (err) {
      console.log(err)
      message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`)
    }
    data.Mod.Logs.channel = channel.id
    await data.save()
      .then(() => {
        const embed = new discord.EmbedBuilder()
          .setColor('DarkGreen')
          .setDescription([
            '<a:Correct:812104211386728498>\u2000|\u2000',
            `Successfully set the Logs channel to ${channel}!\n\n`,
            !data.Mod.Logs.isEnabled ? `\\⚠️ Logs channel is disabled! To enable, type \`${client.prefix}logstoggle\`\n` :
              `To disable this feature, use the \`${client.prefix}logstoggle\` command.`
          ].join(''))
        message.channel.send({ embeds: [embed] })
      })
  }
}