const discord = require("discord.js");
const schema = require("../../schema/TimeOut-Schema");
const momentTz = require("moment-timezone");

/**
 * @param {import('../../struct/Client')} client
 */
module.exports = async (client) => {
  try {
    const fetch = (await import("node-fetch")).default;

    if (!client.database.connected) return;
    let data;

    try {
      data = await schema.find({});
    } catch (err) {
      console.log(err);
      console.log(
        `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`
      );
    }

    if (!data) {
      return;
    }

    let memberUserIds = data.map((obj) => obj.userId);

    let members = [];
    for (let userId of memberUserIds) {
      try {
        const user = await client.users.fetch(userId);
        if (user) {
          members.push(data.find((obj) => obj.userId === userId));
        }
      } catch (err) {
        return;
      }
    }

    members = members.sort(function (b, a) {
      return a.Reminder.time - b.Reminder.time;
    });

    const normalReminders = members.filter(async function (value) {
      return value.Reminder.time > 0 || value.Reminder.time > Date.now();
    });

    const autoReminders = members.filter(function (value) {
      return value.Reminder.Prays.autoPray;
    });

    normalReminders.forEach(async (member) => {
      const ReminderTime = Math.floor(member.Reminder.time.getTime());

      if (ReminderTime > Date.now() || !member.Reminder.current) {
        return;
      } else {
        // Do nothing...
      }

      const user = client.users.cache.get(member.userId);
      member.Reminder.current = false;
      member.Reminder.time = 0;
      await member.save().then(async () => {
        const reminderEmbed = new discord.EmbedBuilder()
          .setAuthor({
            name: "Reminder Alert!",
            iconURL: user.displayAvatarURL(),
          })
          .setColor("DarkGreen")
          .addFields({ name: "❯ Remind Reason", value: member.Reminder.reason })
          .setTimestamp()
          .setFooter({
            text: "Successfully Reminded!",
            iconURL: client.user.displayAvatarURL(),
          });
        try {
          await user.send({ embeds: [reminderEmbed] });
        } catch {
          return; //message.channel.send({ content: `> **Here is your reminder! • [** <@${message.author.id}> **]**`, embeds: [reminderEmbed]});
        }
      });
    });
  } catch (error) {
    client.logDetailedError({ error, eventType: "Reminder check" });
  }

};
