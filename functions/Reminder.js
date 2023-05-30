const discord = require("discord.js");
const { Client } = require("discord.js");
const schema = require("../schema/TimeOut-Schema");
const momentTz = require('moment-timezone');

/**
 * @param {Client} client
 */

module.exports = async (client) => {
  await new Promise((r) => setTimeout(r, 10000));
  const checkReminders = async () => {
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

    async function CurrentTime(timezone = "UTC") {
      const now = momentTz().tz(timezone);
      const isDST = now.isDST();

      let options = {
        timeZone: timezone,
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false, // Use 24-hour format
      };

      let formatter = new Intl.DateTimeFormat([], options);
      const d = new Date(formatter.format(now.toDate()).split(",").join(" "));

      // Adjust the time for DST if applicable
      if (isDST) {
        d.setHours(d.getHours() + 1);
      }

      return Math.floor(d.getTime() / 1000);
    }

    let members = [];

    for (let obj of data) {
      if (client.users.cache.map((user) => user.id).includes(obj.userId))
        members.push(obj);
    }

    members = members.sort(function (b, a) {
      return a.Reminder.time - b.Reminder.time;
    });

    members = members.filter(async function BigEnough(value) {
      let nowMS = await CurrentTime(value.Reminder.timezone);
      return value.Reminder.time > 0 || value.Reminder.time > nowMS;
    });


    members.forEach(async (member) => {
      nowMS = await CurrentTime(member.Reminder.timezone);
      const ReminderTime = Math.floor(member.Reminder.time.getTime() / 1000)

      if (ReminderTime > nowMS || !member.Reminder.current) {
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
    setTimeout(checkReminders, 30000);
  };
  checkReminders();
};
