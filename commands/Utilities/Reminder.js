const discord = require('discord.js');
const ms = require('ms');
const schema = require('../../schema/reminder-Schema');
const { ErrorEmbed } = require('../../util/modules/embeds');
const { setReminder } = require("../../util/functions/reminder");

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
  name: "remind",
  aliases: ["remindme", "reminder"],
  dmOnly: false,
  guildOnly: true,
  args: true,
  usage: '<time> <reason>',
  group: 'Utilities',
  description: 'The bot will remind you after a period of time.',
  cooldown: 5,
  guarded: false,
  permissions: ["UseExternalEmojis"],
  examples: [
    '5m To start my new project!',
    '30s To skip this ad'
  ],

  async execute(client, message, args) {
    let reason = args.slice(1).join(" ");
    let time = args[0];

    if (!time || !ms(time)) {
      return message.channel.send({
        embeds: [ErrorEmbed(`Error! You must provide a valid duration! \`${client.prefix}remind [time] [reason]\``)]
      });
    };


    if (!reason) {
      return message.channel.send({
        embeds: [ErrorEmbed(`Error! Please state your reminder reason! \`${client.prefix}remind [time] [reason]\``)]
      });
    }

    const reminderTime = Date.now() + ms(time);
    if (isNaN(reminderTime)) {
      return message.channel.send({
        embeds: [ErrorEmbed(`Error! Invalid time duration provided!`)]
      });
    }

    try {
      const reminder = await schema.create({
        userId: message.author.id,
        time: reminderTime,
        reason: reason,
      });

      setReminder(client, reminder);

      message.channel.send({
        embeds: [new discord.EmbedBuilder()
          .setAuthor({ name: '| Reminder Set!', iconURL: message.author.displayAvatarURL() })
          .setDescription(`Successfully set \`${message.author.tag}'s\` reminder!`)
          .addFields(
            { name: '- Remind You in:', value: `<t:${Math.floor(reminderTime/1000)}:R>` },
            { name: '- Remind Reason:', value: reason }
          )
          .setColor('Green')
          .setTimestamp()
          .setFooter({ text: 'Successfully set the reminder!', iconURL: client.user.displayAvatarURL() })
        ]
      });
    } catch (err) {
      return message.channel.send({
        embeds: [ErrorEmbed(`\❌ **${message.author.tag}**, Something went wrong! [\`${err.name}\`]`)]
      });
    }
  }
};