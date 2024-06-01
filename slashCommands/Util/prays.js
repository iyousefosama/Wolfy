const discord = require("discord.js");
const {
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");
const fetch = require("node-fetch");
const tc = require("../../functions/TimeConvert");
const cfl = require("../../functions/CapitalizedChar");
const schema = require("../../schema/TimeOut-Schema");
const moment = require("moment");
const momentTz = require("moment-timezone");
let dinMS;

module.exports = {
  clientPermissions: [
    discord.PermissionsBitField.Flags.EmbedLinks,
    discord.PermissionsBitField.Flags.ReadMessageHistory,
  ],
  data: new SlashCommandBuilder()
    .setName("prays")
    .setDescription("Replies with prays times!")
    .addStringOption((option) =>
      option
        .setName("country")
        .setDescription("Enter country name.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("city")
        .setDescription("Enter city name.")
        .setRequired(true)
    ),
  async execute(client, interaction) {
    try {
      async function LoadButtons(MAX_BTNS, arr) {
        const MAX_BUTTONS_PER_ROW = 5;
        const MAX_BUTTONS_PER_MESSAGE = MAX_BTNS;

        const buttonRows = [];
        let currentRow = new ActionRowBuilder();

        for (let i = 0; i < arr.length; i++) {
          const [label, value] = arr[i];
          const button = new ButtonBuilder()
            .setLabel(label)
            .setCustomId(`${label} ${value}`)
            .setStyle(1);

          if (
            currentRow.components.length >= MAX_BUTTONS_PER_ROW ||
            buttonRows.length * MAX_BUTTONS_PER_ROW +
              currentRow.components.length >=
              MAX_BUTTONS_PER_MESSAGE
          ) {
            buttonRows.push(currentRow);
            currentRow = new ActionRowBuilder();
          }

          currentRow.addComponents(button);
        }

        if (currentRow.components.length > 0) {
          buttonRows.push(currentRow);
        }

        return buttonRows;
      }

      async function setReminder(interaction, timezone, prayerTime) {
        try {
          let data = await schema.findOne({ userId: interaction.user.id });

          if (!data) {
            data = await schema.create({ userId: interaction.user.id });
          }

          if (data.Reminder.current) {
            await interaction.channel
              .send(
                `${interaction.user}, looks like you already have an \`active reminder\`, do you want to add this one instead? \`(y/n)\``
              )
              .catch(() => null);

            const filter = (_message) =>
              interaction.user.id === _message.author.id &&
              ["y", "n", "yes", "no"].includes(_message.content.toLowerCase());

            const proceed = await interaction.channel
              .awaitMessages({ filter, max: 1, time: 40000, errors: ["time"] })
              .then((collected) =>
                ["y", "yes"].includes(collected.first().content.toLowerCase())
                  ? true
                  : false
              )
              .catch(() => false);

            if (!proceed) {
              return interaction.channel
                .send({
                  content: `\\❌ | **${interaction.user.tag}**, Cancelled the \`reminder\`!`,
                  ephemeral: true,
                })
                .catch(() => null);
            }
          }

          const [hours, minutes] = prayerTime.split(":");

          let currentDatetime;
          await CurrentTime(timezone).then(async (time) => {
            currentDatetime = time.date.toLocaleString("en-US", {
              timeZone: time.timezone,
              hour12: false,
            });
          });

          const [date, time] = currentDatetime.split(", ");
          const [month, day, year] = date.split("/");
          const [hour, minute, second] = time.split(":");

          const prayerDatetime = new Date(
            +year,
            month - 1,
            day,
            hours,
            minutes
          ).getTime();

          const currentTime = new Date(
            +year,
            month - 1,
            day,
            hour,
            minute,
            second
          ).getTime();

          const TimeDiff = prayerDatetime - currentTime;

          if (currentTime >= prayerDatetime || TimeDiff <= 0) {
            return interaction
              .reply({
                content: `\\❌ ${interaction.user}, This pray time has already passed!`,
                ephemeral: true,
              })
              .catch(() => null);
          }

          const Reason = interaction.customId.split(" ")[0];

          data.Reminder.current = true;
          data.Reminder.time = prayerDatetime;
          data.Reminder.reason = `${Reason} will start soon`;
          data.Reminder.timezone = timezone;

          await data.save();

          /*
          const duration = moment.duration(TimeDiff, "milliseconds");
          const formattedDuration = duration.format(
            "H [hours,] m [minutes, and] s [seconds,]"
          );
          */

          const dnEmbed = new discord.EmbedBuilder()
            .setAuthor({
              name: "| Reminder Set!",
              iconURL: interaction.user.displayAvatarURL(),
            })
            .setDescription(
              `Successfully set \`${interaction.user.tag}'s\` reminder!`
            )
            .addFields(
              {
                name: "❯ Remind You In:",
                value: `<t:${prayerDatetime / 1000}:R>`,
              },
              {
                name: "❯ Remind Reason:",
                value: `${Reason} will start soon`,
              }
            )
            .setColor("Green")
            .setTimestamp()
            .setFooter({
              text: "Successfully set the reminder!",
              iconURL: client.user.displayAvatarURL(),
            });

          interaction.channel
            .send({ embeds: [dnEmbed], ephemeral: true })
            .catch(() => null);
        } catch (err) {
          console.error(err);
        }
      }

      async function CurrentTime(timezone) {
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
          hour12: false,
        };

        let formatter = new Intl.DateTimeFormat([], options);
        const d = new Date(formatter.format(now.toDate()).split(",").join(" "));

        if (isDST) {
          d.setHours(d.getHours() + 1);
        }

        return {
          date: d,
          timezone: timezone,
          MiliSeconds: Math.floor(d.getTime() / 1000),
        };
      }

      const country = interaction.options.getString("country");
      const city = interaction.options.getString("city");

      const url = `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}`;
      const options = {
        method: "GET",
      };

      fetch(url, options)
        .then((res) => res.json())
        .then(async (json) => {
          if (json.code != 200) {
            return interaction.reply({
              content:
                "<:error:888264104081522698> Please enter valid country and city in the options!",
            });
          }

          let rows = [];
          const json_data = json.data.timings;
          let result = Object.entries(json_data)
            .filter(([key]) => key !== "Imsak" && key !== "Sunset")
            .map(([key, value]) => [key, value]);

          rows = await LoadButtons(25, result);

          const timezone = json.data.meta.timezone;

          try {
            if (timezone) {
              dinMS = await CurrentTime(timezone).then(
                (time) => time.MiliSeconds
              );
            } else {
              return await interaction.reply({
                content:
                  "<:error:888264104081522698> I can't identify this timezone, please write the right `City, Country`!",
              });
            }
          } catch (e) {
            console.error(e);
            return await interaction.reply({
              content:
                "<:error:888264104081522698> I can't identify this timezone, please write the right `City, Country`!",
            });
          }

          let pTimeInMS;
          let str;
          let nxtStr = null;
          let num = -1;
          let marked = false;

          for (const pTime of result) {
            num++;
            str = `${json.data.date.readable.split(" ").join("/")} ${pTime[1]}`;
            const [dateComponents, timeComponents] = str.split(" ");
            const [day, month, year] = dateComponents.split("/");
            const [hours, minutes] = timeComponents.split(":");

            const formatter = new Intl.DateTimeFormat([], { month: "numeric" });
            const monthNumber = formatter.format(
              new Date(`${year}-${month}-${day}`)
            );
            pTimeInMS = Math.floor(
              new Date(
                +year,
                monthNumber - 1,
                +day,
                +hours,
                +minutes,
                0
              ).getTime() / 1000
            );

            if (dinMS < pTimeInMS) {
              if (!marked) {
                const TimeDiff = Math.floor(pTimeInMS - dinMS) * 1000;
                nxtStr = `${pTime[0]} - *${moment
                  .duration(TimeDiff, "milliseconds")
                  .humanize()}*!`;
                result[num][0] = pTime[0] + "(`Next`)";
                marked = true;
              }
            }
          }

          const ActionRow = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
              .setCustomId("kwthbek4m221pyddhwp4")
              .setPlaceholder("Nothing selected!")
              .addOptions([
                {
                  label: "Remind Before",
                  description: `Choose this option to set a time to remind to before the pray (like 5 minutes before)`,
                  value: "remind_before1",
                },
                {
                  label: "Set timezone",
                  description: `Choose this option to set the default timezone for the cmd.`,
                  value: "timezone1",
                },
                {
                  label: "Auto Reminder",
                  description: `Choose this option to get notified before every pray.`,
                  value: "auto_reminder1",
                },
              ])
          );

          rows.push(ActionRow);

          const embed = new discord.EmbedBuilder()
            .setAuthor({
              name: interaction.user.username,
              iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
            })
            .setDescription(
              [
                `<:Tag:836168214525509653> Praying times for country \`${cfl.capitalizeFirstLetter(
                  country
                )}\` in city \`${cfl.capitalizeFirstLetter(city)}\`!`,
                `You can set a \`reminder\` for the next pray from the **buttons** below, use the **action Row** to set the \`default timezone\` and if you want the \`auto reminder\`.`,
              ].join("\n")
            )
            .addFields(
              {
                name: "<:star:888264104026992670> Date",
                value: `<t:${dinMS}>`,
                inline: false,
              },
              {
                name: "<:Timer:853494926850654249> Next Pray in:",
                value: nxtStr || "Tomorrow!",
                inline: false,
              },
              { name: " ‍ ", value: ` ‍ `, inline: false }
            )
            .addFields(
              result.flatMap((i) => [
                {
                  name: i[0],
                  value: `\`\`\`${tc.tConvert(i[1])}\`\`\``,
                  inline: true,
                },
              ])
            )
            .setFooter({
              text: [
                `Based on: ${
                  json.data.meta.method.name
                    ? json.data.meta.method.name
                    : "Unknown"
                }\n`,
                "Times may vary!",
              ].join(" "),
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp();
          await interaction
            .reply({ embeds: [embed], components: rows })
            .then((msg) => {
              const filter = (int) => int.user.id == interaction.user.id;

              const collector = msg.createMessageComponentCollector({
                filter: filter,
                time: 180000,
                fetch: true,
              });

              collector.on("collect", async (interaction) => {
                if (interaction.isButton()) {
                  interaction.deferUpdate().then(async () => {
                    const PrayingTime = result.find(
                      (time) => time[1] === interaction.customId.split(" ")[1]
                    )[1];
                    await setReminder(interaction, timezone, PrayingTime);
                  });
                } else {
                  return;
                }
              });

              collector.on("end", async () => {
                return await msg.edit({ embeds: [embed], components: [] });
              });
            });
        })
        .catch((err) => {
          console.log(err);
          interaction.reply({
            content: `<:error:888264104081522698> ${interaction.user} Something went wrong, please try again later!`,
          });
        });
    } catch (error) {
      console.error("Error in execute function:", error);
      interaction.reply({
        content: "An error occurred. Please try again later.",
        ephemeral: true,
      });
    }
  },
};