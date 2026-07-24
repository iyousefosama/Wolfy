const discord = require("discord.js");
const tc = require("../../util/functions/TimeConvert");
const cfl = require("../../util/functions/CapitalizedChar");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
const axios = require("axios");
const { colors } = require("../../util/constants/constants");

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "prays",
    description: "Replies with prayer times!",
    dmOnly: false,
    guildOnly: false,
    cooldown: 0,
    group: "Utility",
    integration_types: [0, 1],
    contexts: [0, 1, 2],
    clientPermissions: [],
    permissions: [],
    options: [
      {
        type: 3, // STRING
        name: "country",
        description: "Enter country name.",
        required: true,
      },
      {
        type: 3, // STRING
        name: "city",
        description: "Enter city name.",
        required: true,
      },
    ],
  },

  async execute(client, interaction) {
    const country = interaction.options.getString("country");
    const city = interaction.options.getString("city");
    const url = `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}`;

    try {
      // Fetch prayer timings using axios
      const response = await axios.get(url);

      if (response.data.code !== 200) {
        return interaction.reply({
          content: `❌ | ${interaction.user}, Please provide a valid city name!`,
          ephemeral: true,
        });
      }

      const { timings, meta } = response.data.data;
      const timezone = meta.timezone;

      // Extract prayer times except Imsak, Sunset, Midnight, Firstthird, and Lastthird
      const filteredTimings = Object.entries(timings).filter(
        ([key]) =>
          !["Imsak", "Sunset", "Midnight", "Firstthird", "Lastthird"].includes(
            key
          )
      );

      // Get the current time according to the API's timezone
      const currentTime = getCurrentTime(timezone).unix();
      const capitalizedCountry = cfl.capitalizeFirstLetter(country);
      const capitalizedCity = cfl.capitalizeFirstLetter(city);
      const year = new Date().getFullYear();

      // Create the embed with the prayer times and the current time
      const embed = new discord.EmbedBuilder()
        .setColor(colors.UTILITY)
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .setTitle(`Prayer Times for ${capitalizedCity}, ${capitalizedCountry}`)
        .addFields(
          {
            name: "⭐ Date",
            value: `<t:${currentTime}>`,
            inline: false,
          },
          { name: " ‍ ", value: ` ‍ `, inline: false }
        );
      
      // Add prayer times fields
      if (timings.Fajr) {
        embed.addFields({
          name: "Fajr",
          value: tc.tConvert(timings.Fajr),
          inline: true,
        });
      }
      
      if (timings.Sunrise) {
        embed.addFields({
          name: "Sunrise",
          value: tc.tConvert(timings.Sunrise),
          inline: true,
        });
      }
      
      if (timings.Dhuhr) {
        embed.addFields({
          name: "Dhuhr",
          value: tc.tConvert(timings.Dhuhr),
          inline: true,
        });
      }
      
      if (timings.Asr) {
        embed.addFields({
          name: "Asr",
          value: tc.tConvert(timings.Asr),
          inline: true,
        });
      }
      
      if (timings.Maghrib) {
        embed.addFields({
          name: "Maghrib",
          value: tc.tConvert(timings.Maghrib),
          inline: true,
        });
      }
      
      if (timings.Isha) {
        embed.addFields({
          name: "Isha",
          value: tc.tConvert(timings.Isha),
          inline: true,
        });
      }
      
      embed.setFooter({
        text: `Prayer Times | ©${year} Wolfy`,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Error in execute function:", error);
      interaction.reply({
        content: `❌ I couldn't find prayer times for that location!`,
        ephemeral: true,
      });
    }
  },
};

/**
 * Get the current time according to the given timezone.
 * @param {string} timezone
 * @returns {dayjs.Dayjs}
 */
function getCurrentTime(timezone) {
  try {
    const now = dayjs().tz(timezone);
    return now;
  } catch (error) {
    console.error("Error getting current time:", error);
    return dayjs(); // Fallback to local time if timezone fetch fails
  }
}

/**
 * Find the next prayer time based on current time.
 * @param {Array} timings Array of prayer timings [name, time]
 * @param {string} timezone Timezone string
 * @param {number} currentTime Current time in Unix format
 * @returns {Object} The next prayer time and its name
 */
function getNextPrayerTime(timings, timezone, currentTime) {
  const prayerTimes = timings.map(([name, time]) => {
    const [hours, minutes] = time.split(":").map(Number);
    const prayerTime = dayjs().tz(timezone).set({ hour: hours, minute: minutes, second: 0 });
    return {
      name,
      time,
      unix: prayerTime.unix()
    };
  });

  // Find the next prayer time
  const nextPrayer = prayerTimes
    .filter(prayer => prayer.unix > currentTime)
    .sort((a, b) => a.unix - b.unix)[0];

  console.log("Next Prayer:", nextPrayer);

  return nextPrayer || { name: "No upcoming prayer", time: "N/A" };
}
