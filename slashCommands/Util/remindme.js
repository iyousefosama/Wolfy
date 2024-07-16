const discord = require('discord.js');
const ms = require('ms')
const schema = require('../../schema/TimeOut-Schema')
const { ErrorEmbed, SuccessEmbed } = require('../../util/modules/embeds')

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "remindme",
    description: "The bot will reminde you for anything after a period of time.",
    dmOnly: false,
    guildOnly: false,
    cooldown: 0,
    group: "Utility",
    clientPermissions: ["SendMessages"],
    permissions: [],
    options: [
      {
        type: 3, // STRING
        name: 'time',
        description: 'The time after which you want to be reminded (ex: 5h)',
        required: true
      },
      {
        type: 3, // STRING
        name: 'reminder',
        description: 'Reminder to send you after the specified time',
        required: false
      },
    ]
  },
  async execute(client, interaction) {
    const { options, guild } = interaction;
    const reason = options.getString("reminder");
    const time = options.getString("time");

    let data;
    try {
      data = await schema.findOne({ userId: interaction.user.id });
      if (!data) {
        data = await schema.create({ userId: interaction.user.id });
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
        return interaction.reply({
          embeds: [SuccessEmbed(`<:Success:888264105851490355> Successfully canceled the last reminder!`)]
        });
      } catch (err) {
        return interaction.reply({
          embeds: [ErrorEmbed(`\\❌ Something went wrong! [\`${err.name}\`]`)],
          ephemeral: true
        });
      }
    }

    // Input checking
    if (!time || !ms(time)) {
      return interaction.reply({
        embeds: [ErrorEmbed(`\\❌ You must state a duration for your reminder! \`/remindme [time] [reason]\``)],
        ephemeral: true
      });
    }

    if (!reason) {
      return interaction.reply({
        embeds: [ErrorEmbed(`\\❌ Please state your reminder reason! \`/remindme [time] [reason]\``)],
        ephemeral: true
      });
    }

    if (data.Reminder.current) {
      return interaction.reply({
        content: `\\❌ It looks like you already have an active reminder! Cancel it by \`/remindme time: 0\``,
        ephemeral: true
      });
    }

    // Set reminder
    data.Reminder.current = true;
    data.Reminder.time = Math.floor(Date.now() + ms(time));
    data.Reminder.reason = reason;
    try {
      await data.save();
      interaction.reply({
        embeds: [new discord.EmbedBuilder()
          .setAuthor({ name: '| Reminder Set!', iconURL: interaction.user.displayAvatarURL() })
          .setDescription(`Successfully set \`${interaction.user.username}'s\` reminder!`)
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
      return interaction.reply({
        embeds: [ErrorEmbed(`\\❌ **${message.author.tag}**, Something went wrong! [\`${err.name}\`]`)],
        ephemeral: true
      });
    }
  },
};
