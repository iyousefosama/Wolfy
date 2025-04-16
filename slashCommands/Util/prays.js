const discord = require("discord.js");
const tc = require("../../util/functions/TimeConvert");
const cfl = require("../../util/functions/CapitalizedChar");
const momentTz = require("moment-timezone");
const axios = require("axios");

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
          content: client.language.getString("PRAYS_INVALID", interaction.guildId, { user: interaction.user }),
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
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .setTitle(client.language.getString("PRAYS_TITLE", interaction.guildId, { 
          city: capitalizedCity, 
          country: capitalizedCountry 
        }))
        .addFields(
          {
            name: client.language.getString("PRAY_DATE", interaction.guildId, { default: "<:star:888264104026992670> Date" }),
            value: `<t:${currentTime}>`,
            inline: false,
          },
          { name: " ‍ ", value: ` ‍ `, inline: false }
        );
      
      // Add prayer times fields
      if (timings.Fajr) {
        embed.addFields({
          name: client.language.getString("PRAY_NAME_FAJR", interaction.guildId, { default: "Fajr" }),
          value: tc.tConvert(timings.Fajr),
          inline: true,
        });
      }
      
      if (timings.Sunrise) {
        embed.addFields({
          name: client.language.getString("PRAY_NAME_SUNRISE", interaction.guildId, { default: "Sunrise" }),
          value: tc.tConvert(timings.Sunrise),
          inline: true,
        });
      }
      
      if (timings.Dhuhr) {
        embed.addFields({
          name: client.language.getString("PRAY_NAME_DHUHR", interaction.guildId, { default: "Dhuhr" }),
          value: tc.tConvert(timings.Dhuhr),
          inline: true,
        });
      }
      
      if (timings.Asr) {
        embed.addFields({
          name: client.language.getString("PRAY_NAME_ASR", interaction.guildId, { default: "Asr" }),
          value: tc.tConvert(timings.Asr),
          inline: true,
        });
      }
      
      if (timings.Maghrib) {
        embed.addFields({
          name: client.language.getString("PRAY_NAME_MAGHRIB", interaction.guildId, { default: "Maghrib" }),
          value: tc.tConvert(timings.Maghrib),
          inline: true,
        });
      }
      
      if (timings.Isha) {
        embed.addFields({
          name: client.language.getString("PRAY_NAME_ISHA", interaction.guildId, { default: "Isha" }),
          value: tc.tConvert(timings.Isha),
          inline: true,
        });
      }
      
      embed.setFooter({
        text: client.language.getString("PRAYS_FOOTER", interaction.guildId, { year }),
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Error in execute function:", error);
      interaction.reply({
        content: client.language.getString("PRAYS_ERROR", interaction.guildId, { user: interaction.user }),
        ephemeral: true,
      });
    }
  },
};

/**
 * Get the current time according to the given timezone.
 * @param {string} timezone
 * @returns {momentTz.Moment}
 */
function getCurrentTime(timezone) {
  try {
    const now = momentTz().tz(timezone, false);
    return now;
  } catch (error) {
    console.error("Error getting current time:", error);
    return momentTz(); // Fallback to local time if timezone fetch fails
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
    const prayerTime = momentTz().tz(timezone).set({ hour: hours, minute: minutes, second: 0 });
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
