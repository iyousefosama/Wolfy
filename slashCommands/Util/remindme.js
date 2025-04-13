const discord = require('discord.js');
const ms = require('ms');
const reminderSchema = require('../../schema/reminder-Schema');
const { setReminder } = require('../../util/functions/reminder');
const { ErrorEmbed, SuccessEmbed, InfoEmbed } = require('../../util/modules/embeds');

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

    // Cancel reminder if time is "0"
    if (time === "0") {
      try {
        const result = await reminderSchema.deleteOne({ 
          userId: interaction.user.id,
          active: true
        });

        if (result.deletedCount > 0) {
          return interaction.reply({
            embeds: [SuccessEmbed(client.language.getString("SUCCESS_REMIND_CANCELED", interaction.guild?.id))]
          });
        } else {
          return interaction.reply({
            content: client.language.getString("ERROR_REMIND_NO_ACTIVE", interaction.guild?.id),
            ephemeral: true
          });
        }
      } catch (err) {
        console.error('Error canceling reminder:', err);
        return interaction.reply({
          embeds: [ErrorEmbed(client.language.getString("ERROR_EXEC", interaction.guild?.id, { error: err.name }))],
          ephemeral: true
        });
      }
    }

    // Input checking
    if (!time || !ms(time)) {
      return interaction.reply({
        embeds: [ErrorEmbed(client.language.getString("REMIND_INVALID_TIME", interaction.guild?.id))],
        ephemeral: true
      });
    }

    // Check if reminder time is too long (more than 7 days)
    if (ms(time) > 7 * 24 * 60 * 60 * 1000) {
      return interaction.reply({
        embeds: [ErrorEmbed(client.language.getString("REMIND_TOO_LONG", interaction.guild?.id))],
        ephemeral: true
      });
    }

    // Check if reminder time is too short (less than 1 minute)
    if (ms(time) < 60 * 1000) {
      return interaction.reply({
        embeds: [ErrorEmbed(client.language.getString("REMIND_TOO_SHORT", interaction.guild?.id))],
        ephemeral: true
      });
    }

    if (!reason) {
      return interaction.reply({
        embeds: [ErrorEmbed(client.language.getString("ERROR_REMIND_NO_REASON", interaction.guild?.id))],
        ephemeral: true
      });
    }

    // Check for existing active reminder
    const existingReminder = await reminderSchema.findOne({ 
      userId: interaction.user.id,
      active: true
    });

    if (existingReminder) {
      return interaction.reply({
        content: client.language.getString("ERROR_REMIND_ALREADY_ACTIVE", interaction.guild?.id),
        ephemeral: true
      });
    }

    // Set reminder
    const reminderTime = Math.floor(Date.now() + ms(time));
    try {
      // Create new reminder document
      const newReminder = await reminderSchema.create({
        userId: interaction.user.id,
        time: reminderTime,
        reason: reason,
        active: true
      });
      
      // Setup the reminder with the utility function
      setReminder(client, newReminder);
      
      // Format time for display
      const formattedTime = time;
      
      interaction.reply({
        embeds: [InfoEmbed(client.language.getString("REMIND_SET", interaction.guild?.id, { 
          message: reason, 
          time: formattedTime 
        }))]
      });
    } catch (err) {
      console.error('Error setting reminder:', err);
      return interaction.reply({
        embeds: [ErrorEmbed(client.language.getString("ERROR_EXEC", interaction.guild?.id, { error: err.name }))],
        ephemeral: true
      });
    }
  },
};
