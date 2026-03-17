const ms = require('ms');
const reminderSchema = require('../../schema/reminder-Schema');
const { setReminder, cancelReminder } = require('../../util/functions/reminder');
const { ErrorEmbed, SuccessEmbed, InfoEmbed } = require('../../util/modules/embeds');

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "remindme",
    description: "Manage your reminders - set, list, or cancel reminders",
    dmOnly: false,
    guildOnly: false,
    cooldown: 0,
    group: "Utility",
    clientPermissions: ["SendMessages"],
    permissions: [],
    integration_types: [0, 1],
    contexts: [0, 1, 2],
    options: [
      {
        type: 1, // SUB_COMMAND
        name: "set",
        description: "Set a new reminder",
        options: [
          {
            type: 3, // STRING
            name: 'time',
            description: 'Time until reminder (e.g., 5m, 2h, 1d)',
            required: true
          },
          {
            type: 3, // STRING
            name: 'message',
            description: 'What to remind you about',
            required: true
          },
          {
            type: 5, // BOOLEAN
            name: 'silent',
            description: 'Send confirmation without AI response (default: false)',
            required: false
          }
        ]
      },
      {
        type: 1, // SUB_COMMAND
        name: "list",
        description: "View all your active reminders"
      },
      {
        type: 1, // SUB_COMMAND
        name: "stop",
        description: "Cancel a specific reminder",
        options: [
          {
            type: 4, // INTEGER
            name: 'index',
            description: 'Reminder number from /remindme list',
            required: true
          }
        ]
      },
      {
        type: 1, // SUB_COMMAND
        name: "stopall",
        description: "Cancel all your active reminders"
      }
    ]
  },

  async execute(client, interaction) {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case "set": {
        await handleSetReminder(client, interaction);
        break;
      }
      case "list": {
        await handleListReminders(client, interaction);
        break;
      }
      case "stop": {
        await handleStopReminder(client, interaction);
        break;
      }
      case "stopall": {
        await handleStopAllReminders(client, interaction);
        break;
      }
    }
  }
};

/**
 * Handle the 'set' subcommand - create a new reminder
 */
async function handleSetReminder(client, interaction) {
  const timeInput = interaction.options.getString("time");
  const message = interaction.options.getString("message");
  const silent = interaction.options.getBoolean("silent") ?? false;

  // Validate time input
  const timeMs = ms(timeInput);
  if (!timeMs) {
    return interaction.reply({
      embeds: [ErrorEmbed("Please provide a valid time format (e.g., `5m`, `2h`, `1d`, `30s`)")],
      ephemeral: true
    });
  }

  // Check time constraints
  const maxTime = 7 * 24 * 60 * 60 * 1000; // 7 days
  const minTime = 30 * 1000; // 30 seconds

  if (timeMs > maxTime) {
    return interaction.reply({
      embeds: [ErrorEmbed("Reminders cannot be set for more than 7 days in the future")],
      ephemeral: true
    });
  }

  if (timeMs < minTime) {
    return interaction.reply({
      embeds: [ErrorEmbed("Reminders must be at least 30 seconds in the future")],
      ephemeral: true
    });
  }

  // Check reminder limit (max 10 per user)
  const activeCount = await reminderSchema.countDocuments({
    userId: interaction.user.id,
    active: true
  });

  if (activeCount >= 10) {
    return interaction.reply({
      embeds: [ErrorEmbed("You have reached the maximum of 10 active reminders. Use `/remindme list` to see them or `/remindme stopall` to clear them.")],
      ephemeral: true
    });
  }

  // Create reminder
  const reminderTime = Date.now() + timeMs;
  try {
    const newReminder = await reminderSchema.create({
      userId: interaction.user.id,
      time: reminderTime,
      reason: message,
      channelId: interaction.channelId,
      guildId: interaction.guildId,
      active: true
    });

    // Setup the reminder timer
    setReminder(client, newReminder);

    // Format time for display
    const formattedTime = `<t:${Math.floor(reminderTime / 1000)}:R>`;

    const embed = SuccessEmbed(`I'll remind you ${formattedTime}`)
      .addFields(
        { name: 'Reminder:', value: message },
        { name: 'Active Reminders:', value: `${activeCount + 1}/10` }
      )
      .setAuthor({ name: '| Reminder Set!', iconURL: interaction.user.displayAvatarURL() })
      .setFooter({ text: silent ? 'Silent mode enabled' : 'Use /remindme list to view all reminders' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: silent });

  } catch (err) {
    console.error('Error setting reminder:', err);
    return interaction.reply({
      embeds: [ErrorEmbed(`Failed to set reminder: ${err.message}`)],
      ephemeral: true
    });
  }
}

/**
 * Handle the 'list' subcommand - show active reminders
 */
async function handleListReminders(client, interaction) {
  try {
    const reminders = await reminderSchema.find({
      userId: interaction.user.id,
      active: true,
      time: { $gt: Date.now() }
    }).sort({ time: 1 });

    if (reminders.length === 0) {
      return interaction.reply({
        embeds: [InfoEmbed("You have no active reminders. Use `/remindme set` to create one!")],
        ephemeral: true
      });
    }

    const embed = InfoEmbed(`You have **${reminders.length}/10** active reminders`)
      .setAuthor({ name: '| Your Active Reminders', iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp();

    const reminderFields = reminders.map((reminder, index) => {
      const timeDisplay = `<t:${Math.floor(reminder.time / 1000)}:R>`;
      const reason = reminder.reason.length > 50 
        ? reminder.reason.substring(0, 47) + '...' 
        : reminder.reason;
      return {
        name: `#${index + 1} - ${timeDisplay}`,
        value: reason,
        inline: false
      };
    });

    embed.addFields(reminderFields);
    embed.setFooter({ text: 'Use /remindme stop <number> to cancel a specific reminder' });

    await interaction.reply({ embeds: [embed], ephemeral: true });

  } catch (err) {
    console.error('Error listing reminders:', err);
    return interaction.reply({
      embeds: [ErrorEmbed("Failed to retrieve your reminders")],
      ephemeral: true
    });
  }
}

/**
 * Handle the 'stop' subcommand - cancel a specific reminder
 */
async function handleStopReminder(client, interaction) {
  const index = interaction.options.getInteger("index");

  if (index < 1) {
    return interaction.reply({
      embeds: [ErrorEmbed("Please provide a valid reminder number (1 or higher)")],
      ephemeral: true
    });
  }

  try {
    // Get all active reminders sorted by time
    const reminders = await reminderSchema.find({
      userId: interaction.user.id,
      active: true,
      time: { $gt: Date.now() }
    }).sort({ time: 1 });

    if (reminders.length === 0) {
      return interaction.reply({
        embeds: [ErrorEmbed("You have no active reminders to cancel")],
        ephemeral: true
      });
    }

    if (index > reminders.length) {
      return interaction.reply({
        embeds: [ErrorEmbed(`Invalid reminder number. You only have ${reminders.length} active reminder(s). Use /remindme list to see them.`)],
        ephemeral: true
      });
    }

    // Get the reminder at the specified index (1-based to 0-based)
    const reminderToCancel = reminders[index - 1];

    // Cancel the reminder
    reminderToCancel.active = false;
    await reminderToCancel.save();

    // Cancel the timer if it exists
    cancelReminder(reminderToCancel._id.toString());

    const embed = SuccessEmbed(`Cancelled reminder #${index}`)
      .addFields(
        { name: 'Was set for:', value: `<t:${Math.floor(reminderToCancel.time / 1000)}:R>` },
        { name: 'Reminder:', value: reminderToCancel.reason }
      )
      .setAuthor({ name: '| Reminder Cancelled', iconURL: interaction.user.displayAvatarURL() })
      .setFooter({ text: `${reminders.length - 1} reminder(s) remaining` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

  } catch (err) {
    console.error('Error cancelling reminder:', err);
    return interaction.reply({
      embeds: [ErrorEmbed("Failed to cancel the reminder")],
      ephemeral: true
    });
  }
}

/**
 * Handle the 'stopall' subcommand - cancel all reminders
 */
async function handleStopAllReminders(client, interaction) {
  try {
    const result = await reminderSchema.updateMany(
      { userId: interaction.user.id, active: true },
      { active: false }
    );

    const cancelledCount = result.modifiedCount;

    if (cancelledCount === 0) {
      return interaction.reply({
        embeds: [ErrorEmbed("You have no active reminders to cancel")],
        ephemeral: true
      });
    }

    // Clear all timers for this user's reminders
    const userReminders = await reminderSchema.find({
      userId: interaction.user.id,
      active: false,
      sent: false
    });

    for (const reminder of userReminders) {
      cancelReminder(reminder._id.toString());
    }

    const embed = SuccessEmbed(`Successfully cancelled **${cancelledCount}** reminder(s)`)
      .setAuthor({ name: '| All Reminders Cancelled', iconURL: interaction.user.displayAvatarURL() })
      .setFooter({ text: 'You can create new reminders with /remindme set' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

  } catch (err) {
    console.error('Error cancelling all reminders:', err);
    return interaction.reply({
      embeds: [ErrorEmbed("Failed to cancel reminders")],
      ephemeral: true
    });
  }
}
