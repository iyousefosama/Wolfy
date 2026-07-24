const discord = require("discord.js");
const schema = require("../../schema/Economy-Schema");
const dayjs = require("dayjs");
const duration = require("dayjs/plugin/duration");

dayjs.extend(duration);
const { AttachmentBuilder, EmbedBuilder } = require("discord.js");
const file = new AttachmentBuilder("./assets/Images/treasure.png");
const quests = require("../../assets/json/quests.json");
const _ = require("lodash");
const Pages = require("../../util/Paginate");
const market = require("../../assets/json/market.json");

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "quest",
    description: "Refresh/Show current quests and the current progress.",
    dmOnly: false,
    guildOnly: false,
    cooldown: 0,
    group: "Economy",
    requiresDatabase: true,
    clientPermissions: [],
    permissions: [],
    options: [
      {
        type: 3, // STRING
        name: 'action',
        description: 'Action you want to perform on the command',
        choices: [
          {
            name: 'claim',
            value: 'claim_daily_reward'
          }
        ]
      }
    ]
  },
  async execute(client, interaction) {
    const option = interaction.options.getString("action");

    let data;
    try {
      data = await schema.findOne({
        userID: interaction.user.id,
      });
      if (!data) {
        data = await schema.create({
          userID: interaction.user.id,
        });
      }
    } catch (err) {
      interaction.reply({
        content: `💢 [DATABASE_ERR]: The database responded with error: ${err.name}`,
        flags: ['Ephemeral']
      });
      return client.logDetailedError({
        error: err,
        eventType: "DATABASE_ERR",
        interaction: interaction
      });
    }

    const now = Date.now();
    const duration = Math.floor(86400000);

    if (data.progress.TimeReset < now) {
      let bucket = [];

      for (let i = 0; i < quests.length; i++) {
        bucket.push(i);
      }
      function getRandomFromBucket() {
        let randomIndex = Math.floor(Math.random() * bucket.length);
        return bucket.splice(randomIndex, 1)[0];
      }
      data.progress.quests = [];
      data.progress.completed = 0;
      data.progress.claimed = false;
      data.progress.quests.push(
        quests[getRandomFromBucket()],
        quests[getRandomFromBucket()],
        quests[getRandomFromBucket()],
        quests[getRandomFromBucket()],
        quests[getRandomFromBucket()]
      );
      data.progress.TimeReset = Math.floor(now + duration);
      await data.save();
      return interaction.reply({
        content: `✅ **${interaction.user.tag}**, your daily quests have been refreshed!`
      });
    }

    if (option && option == "claim_daily_reward") {
      if (data.progress.completed < 4) {
        const NotNow = new EmbedBuilder()
          .setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
          })
          .setDescription(
            `⚠️ **Not enough quests completed!**\nYou must complete at least 4 of your daily quests.\n${data.progress.completed ? `You currently completed ${data.progress.completed} out of 4` : ""}`
          )
          .setFooter({
            text: `${interaction.user.tag} | \u00A9${new Date().getFullYear()} Wolfy`,
            iconURL: interaction.user.avatarURL({ dynamic: true }),
          })
          .setTimestamp();
        return interaction.reply({ embeds: [NotNow] });
      } else if (data.progress.claimed) {
        return interaction.reply({
          content: `⚠️ **${interaction.user.tag}**, you have already claimed your daily quest reward!`
        });
      }
      let moneyget = Math.floor(500);
      const rewardables = market.filter((x) => ![5, 20].includes(x.id));
      const item = rewardables[Math.floor(Math.random() * rewardables.length)];
      let itemreward = false;
      const old = data.profile.inventory.find((x) => x.id === item.id);
      if (old) {
        //Do nothing..
      } else {
        itemreward = true;
        data.profile.inventory.push({
          id: item.id,
        });
      }
      data.progress.claimed = true;
      data.credits += Math.floor(moneyget);
      await data
        .save()
        .then(() => {
          const embed = new discord.EmbedBuilder()
            .setTitle("🎁 Daily Quest Reward")
            .setDescription(
              `🎉 **${interaction.user.tag}**, you received **${Math.floor(moneyget)}** from daily quest reward!${itemreward ? `\n\\✔️ You received: **${item.name} - ${item.description}** as a bonus reward.` : ""}`
            )
            .setFooter({
              text: "Complete your daily quests for more rewards!",
              iconURL: interaction.user.displayAvatarURL({
                dynamic: true,
                size: 2048,
              }),
            })
            .setColor("#E6CEA0");
          return interaction.reply({ embeds: [embed] });
        })
        .catch((err) =>
          interaction.reply({
            content: `\\❌ [DATABASE_ERR]: Unable to save the document to the database, please try again later!`,
            flags: ['Ephemeral']
          })
        );
    }
    const QuestEmbed = new Pages(
      _.chunk(data.progress.quests, 4).map((chunk, i, o) => {
        return new EmbedBuilder()
          .setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
          })
          .setTitle("Daily Quests")
          .setDescription(
            `Your daily quests will be refreshed in \`${dayjs.duration(data.progress.TimeReset - now, "milliseconds").format("hh:mm:ss")}\`\nYou completed ${data.progress.completed} out of 4 from your daily quests.\nOnce you complete all the quests type \`${client.prefix}quest claim\` to claim your final reward!\n\n⭐ Your Progress:`
          )
          .setThumbnail("attachment://treasure.png")
          .setFooter({
            text: `${interaction.user.tag} | \u00A9${new Date().getFullYear()} Wolfy`,
            iconURL: interaction.user.avatarURL({ dynamic: true }),
          })
          .addFields(
            ...chunk
              .sort((A, B) => A.id - B.id)
              .map((d) => {
                const quest = quests.find((x) => x.id == d.id);
                const dataquest = data.progress.quests.find(
                  (x) => x.id == d.id
                );
                return {
                  inline: false,
                  name:
                    `${quest.name} (${dataquest.current}/${dataquest.progress})`,
                  value: `**Rewards:** 💰 \`${quest.reward}\` credits`,
                };
              })
          );
      })
    );

    await interaction.reply({
      embeds: [QuestEmbed.firstPage],
      files: [file],
    });
  },
};