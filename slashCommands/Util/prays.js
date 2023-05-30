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
const momentTz = require('moment-timezone');

module.exports = {
  clientpermissions: [
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
    function LoadButtons(MAX_BTNS, arr) {
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
          // Start a new row if the current row is full or the message limit is reached
          buttonRows.push(currentRow);
          currentRow = new ActionRowBuilder();
        }

        currentRow.addComponents(button);
      }

      // Add the last row if it's not empty
      if (currentRow.components.length > 0) {
        buttonRows.push(currentRow);
      }

      return buttonRows;
    }

    ///
    async function setReminder(interaction, timezone, prayerTime) {
      try {
        let data = await schema.findOne({ userId: interaction.user.id });

        if (!data) {
          data = await schema.create({ userId: interaction.user.id });
        }

        if (data.Reminder.current) {
          await interaction.channel.send(`${interaction.user}, looks like you already have an \`active reminder\`, do you want to add this one instead? \`(y/n)\``);

          const filter = _message => interaction.user.id === _message.author.id && ['y','n','yes','no'].includes(_message.content.toLowerCase());
          const proceed = await interaction.channel.awaitMessages({ filter, max: 1, time: 40000, errors: ['time'] })
          .then(collected => ['y','yes'].includes(collected.first().content.toLowerCase()) ? true : false)
          .catch(() => false);
      
          if (!proceed){
            return interaction.channel.send(`\\❌ | **${interaction.user.tag}**, Cancelled the \`reminder\`!`);
          };
        }

        const [hours, minutes] = prayerTime.split(":");

        // Get the current date and time with the correct timezone
        let currentDatetime;
        await CurrentTime(timezone).then(async (time) => {
          currentDatetime = await time.date.toLocaleString("en-US", {
            timeZone: time.timezone,
            hour12: false,
          });
        });

        // Extract the year, month, and day components from the current date and time
        const [date, time] = currentDatetime.split(", ");
        const [month, day, year] = date.split("/");
        const [hour, minute, second] = time.split(":")

        const TimeToRemove = 600000;
        // Set the hour and minute of the current date
        const prayerDatetime = new Date(+year, month - 1, day, hours, minutes);
        const prayTime = Math.floor(prayerDatetime.getTime() - TimeToRemove);

        const currentTime = new Date(+year, month - 1, day, hour, minute, second).getTime();
        const timeDiffInMs = prayTime - currentTime;

        if(currentTime >= prayTime || timeDiffInMs <= 0) {
          return interaction.channel.send({ content: `\\❌ ${interaction.user}, This pray time has already passed!`})
        }

        const Reason = interaction.customId.split(' ')[0]

        data.Reminder.current = true;
        data.Reminder.time = Math.floor(prayTime);
        data.Reminder.reason = `${Reason} will start soon`;
        data.Reminder.timezone = timezone;

        await data.save();

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
              value: moment
                .duration(timeDiffInMs, "milliseconds")
                .format("H [hours,] m [minutes, and] s [seconds,]"),
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

        interaction.channel.send({ embeds: [dnEmbed], ephemeral: true });
      } catch (err) {
        console.log(err);
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
        hour12: false, // Use 24-hour format
      };
    
      let formatter = new Intl.DateTimeFormat([], options);
      const d = new Date(formatter.format(now.toDate()).split(",").join(" "));
    
      // Adjust the time for DST if applicable
      if (isDST) {
        d.setHours(d.getHours() + 1);
      }
    
      return {
        date: d,
        timezone: timezone,
        MiliSeconds: Math.floor(d.getTime() / 1000),
      };
    }
    

    // Main code
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
          return interaction.editReply({
            content:
              "<:error:888264104081522698> Please enter valid country and city in the options!",
          });
        }

        let rows = [];
        var json_data = json.data.timings;
        var result = [];
        for (var i in json_data) result.push([i, json_data[i]]);
        let index;
        index = json_data.Imsak.length - 1;
        result.splice(-index);
        // Find the index of the Sunset array
        index = result.findIndex((elem) => elem[0] === "Sunset");

        // Delete the Sunset array using the splice method
        if (index !== -1) {
          result.splice(index, 1);
        }

        //Declaring the rows array that has all the buttons in row(s)
        rows = await LoadButtons(25, result);

        const timezone = json.data.meta.timezone;

        let dinMS;
        try {
          if (timezone) {
            CurrentTime(timezone).then(async (time) => {
              dinMS = await time.MiliSeconds;
            });
          } else {
            return await interaction.editReply({
              content:
                "<:error:888264104081522698> I can't identify this timezone, please write the right `City, Country`!",
            });
          }
        } catch (e) {
          console.log(e);
          return await interaction.editReply({
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
          const monthNumber = await formatter.format(
            new Date(`${year}-${month}-${day}`)
          );
          pTimeInMS = Math.floor(
            new Date(
              +year,
              monthNumber - 1,
              +day,
              +hours,
              +minutes,
              +00
            ).getTime() / 1000
          );

          if (dinMS < pTimeInMS) {
            if (!marked) {
              const TimeDiff = Math.floor(pTimeInMS - dinMS) * 1000;
              nxtStr = `${pTime[0]}  <t:${pTimeInMS}:R> - *${moment
                .duration(TimeDiff, "milliseconds")
                .format("H [hours, and] m [minutes, and] s [seconds,]")}*!`;
              result[num][0] = pTime[0] + "(`Next`)";
              marked = true;
            }
          }
        }

        // Declaring the actionrow and pushing it to the rows array
        const ActionRow = new ActionRowBuilder().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId("kwthbek4m221pyddhwk2")
            .setPlaceholder("Nothing selected!")
            .addOptions([
              {
                label: "Set timezone",
                description: `Choose this option to set the default timezone for the cmd.`,
                value: "timezone1",
                //emoji: emoji.id,
              },
              {
                label: "Auto Reminder",
                description: `Choose this option to get notified before every pray.`,
                value: "auto_reminder1",
                //emoji: emoji.id,
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
          .editReply({ embeds: [embed], components: rows })
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
                    (time) => time[1] === interaction.customId.split(' ')[1]
                  )[1];
                  await setReminder(interaction, timezone, PrayingTime);
                });
              } else {
                return;
              }
            });
            collector.on("end", async (collection) => {
              return await msg.edit({ embeds: [embed], components: [] });
            });
          });
      })
      .catch((err) => {
        console.log(err);
        interaction.editReply({
          content:
            "<:error:888264104081522698> Something went wrong, please try again later!",
        });
      });
  },
};
