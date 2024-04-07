const discord = require("discord.js");
const { Client } = require("discord.js");
const schema = require("../schema/TimeOut-Schema");
const momentTz = require('moment-timezone');
const fetch = require("node-fetch");
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

    async function getPrayerTimes(timezone) {

      const { country, city } = timezone.split('/');

      const url = `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}`;
      const options = {
        method: "GET",
      };

      try {
        const response = await fetch(url, options).catch(() => {});
        const json = await response.json();
        if (json.code !== 200) {
          return null;
        }

        const json_data = json.data.timings;

        const propertiesToDelete = ["Sunset", "Imsak", "Midnight", "Firstthird", "Lastthird"];

        for (const property of propertiesToDelete) {
          delete json_data[property];
        }

        const result = {};
        for (const key in json_data) {
            const localTime = momentTz(json_data[key], "HH:mm");
            const tzTime = localTime.clone().tz(timezone);
            result[key] = tzTime.unix();
        }

        return result;
      } catch (error) {
        console.error("Error fetching prayer times:", error);
        return null;
      }
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

      return d.getTime();
    }


    let memberUserIds = data.map(obj => obj.userId);

    let members = [];
    for (let userId of memberUserIds) {
      try {
        const user = await client.users.fetch(userId);
        if (user) {
          members.push(data.find(obj => obj.userId === userId));
        }
      } catch (err) {
        console.log(`Failed to fetch user with ID: ${userId}`);
      }
    }

    members = members.sort(function (b, a) {
      return a.Reminder.time - b.Reminder.time;
    });

    const normalReminders = members.filter(async function (value) {
      let nowMS = await CurrentTime(value.Reminder.timezone);
      return value.Reminder.time > 0 || value.Reminder.time > nowMS;
    });
    
    const autoReminders = members.filter(function (value) {
      return value.Reminder.Prays.autoPray;
    });

    normalReminders.forEach(async (member) => {
      nowMS = await CurrentTime(member.Reminder.timezone);
      const ReminderTime = Math.floor(member.Reminder.time.getTime())

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

    autoReminders.forEach(async (member) => {
      const prayerTimes = await getPrayerTimes(member.Reminder.timezone);
      if (prayerTimes) {
        const currentTime = await CurrentTime(member.Reminder.timezone);
        const user = client.users.cache.get(member.userId);
        
        // Sort prayers by time
        const sortedPrayers = Object.entries(prayerTimes).sort((a, b) => a[1] - b[1]);
    
        // Filter upcoming prayers
        const upcomingPrayers = sortedPrayers.filter(
          ([prayerName, prayerTime]) => prayerTime > currentTime
        );
    
        // Get the next prayer
        const nextPrayer = upcomingPrayers.shift();

        if (
          nextPrayer &&
          nextPrayer[0] !== undefined &&
          member.Reminder.Prays.nextPrays.next &&
          member.Reminder.Prays.nextPrays.next[0] !== undefined &&
          nextPrayer[0] !== member.Reminder.Prays.nextPrays.next[0]
        ) {
          member.Reminder.Prays.nextPrays.next = nextPrayer;
          member.Reminder.Prays.nextPrays.current = false;
          await member.save();
        }

        //Check if it passed
        if (!nextPrayer || nextPrayer.length < 2 || nextPrayer[1] > currentTime || !member.Reminder.Prays.nextPrays.current) {
          return;
        } else {
          // Do nothing...
        }
    
        if (nextPrayer) {
          const [prayerName, prayerTime] = nextPrayer;
          const formattedPrayerTime = momentTz.unix(prayerTime).format("HH:mm");
          member.Reminder.Prays.nextPrays = true;
          // Send the autoReminder
          const reminderEmbed = new discord.EmbedBuilder()
            .setAuthor({
              name: "Auto Reminder - Upcoming Prayer",
              iconURL: user.displayAvatarURL(),
            })
            .setColor("DarkGreen")
            .addFields({
              name: "❯ Prayer Time",
              value: `${prayerName}: ${formattedPrayerTime}`,
            })
            .setTimestamp()
            .setFooter({
              text: "Auto Reminder",
              iconURL: client.user.displayAvatarURL(),
            });
    
          try {
            await user.send({ embeds: [reminderEmbed] });
          } catch {
            // Handle error sending the reminder
            return;
          }
        }
      }
    });
    
    

    setTimeout(checkReminders, 30000);
  };
  checkReminders();
};
