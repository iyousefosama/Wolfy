const discord = require('discord.js');
const ms = require('ms')
const schema = require('../../schema/TimeOut-Schema')
const { ErrorEmbed, SuccessEmbed } = require('../../util/modules/embeds')

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
  name: "remind",
  aliases: ["remindme", "reminder"],
  dmOnly: false, //or false
  guildOnly: true, //or false
  args: true, //or false
  usage: '<time> <reason>',
  group: 'Utilities',
  description: 'The bot will reminde you for anything after a period of time.',
  cooldown: 5, //seconds(s)
  guarded: false, //or false
  permissions: ["UseExternalEmojis"],
  examples: [
    '5m To start my new project!',
    '30s To skip this ad'
  ],
  /**
   *
   * @param {import("discord.js").Client} client
   * @param {import("discord.js").Message} message
   * @param {String[]} args
   *
   */
  async execute(client, message, args) {
    let reason = args.slice(1).join(" ");
    let time = args[0];

    let data;
    try {
      data = await schema.findOne({ userId: message.author.id });
      if (!data) {
        data = await schema.create({ userId: message.author.id });
      }
    } catch (err) {
      console.log(err);
      return message.channel.send({
        content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`
      });
    }

    // Cancel reminder if time is "0"
    if (time === "0") {
      data.Reminder.current = false;
      data.Reminder.time = 0;
      data.Reminder.reason = null;
      try {
        await data.save();
        return message.channel.send({
          embeds: [SuccessEmbed(`<:Success:888264105851490355> **${message.author.tag}**, Successfully canceled the last reminder!`)]
        });
      } catch (err) {
        return message.channel.send({
          embeds: [ErrorEmbed(`\\❌ **${message.author.tag}**, Something went wrong! [\`${err.name}\`]`)]
        });
      }
    }

    // Input checking
    if (!time || !ms(time)) {
      return message.channel.send({
        embeds: [ErrorEmbed(`Error! You must state a duration for your reminder! \`${client.prefix}remind [time] [reason]\``)]
      });
    }

    if (!reason) {
      return message.channel.send({
        embeds: [ErrorEmbed(`Error! Please state your reminder reason! \`${client.prefix}remind [time] [reason]\``)]
      });
    }

    if (data.Reminder.current) {
      return message.channel.send({
        content: `\\❌ **${message.author}**, it looks like you already have an active reminder! Cancel it by \`${client.config.prefix}reminder 0\``
      });
    }

    // Set reminder
    data.Reminder.current = true;
    data.Reminder.time = Math.floor(Date.now() + ms(time));
    data.Reminder.reason = reason;
    try {
      await data.save();
      message.channel.send({
        embeds: [new discord.EmbedBuilder()
          .setAuthor({ name: '| Reminder Set!', iconURL: message.author.displayAvatarURL() })
          .setDescription(`Successfully set \`${message.author.tag}'s\` reminder!`)
          .addFields(
            { name: '❯ Remind You In:', value: time },
            { name: '❯ Remind Reason:', value: reason }
          )
          .setColor('Green')
          .setTimestamp()
          .setFooter({ text: 'Successfully set the reminder!', iconURL: client.user.displayAvatarURL() })
        ]
      });
    } catch (err) {
      return message.channel.send({
        embeds: [ErrorEmbed(`\\❌ **${message.author.tag}**, Something went wrong! [\`${err.name}\`]`)]
      });
    }
  }
}