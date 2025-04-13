const discord = require("discord.js");
const schema = require("../../schema/Economy-Schema");
const moment = require("moment");
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
        content: client.language.getString("ERR_DB", interaction.guild?.id, { error: err.name }),
        ephemeral: true
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
        content: client.language.getString("ECONOMY_QUEST_REFRESHED", interaction.guild?.id, { 
          username: interaction.user.tag 
        })
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
            client.language.getString("ECONOMY_QUEST_NOT_COMPLETED", interaction.guild?.id, {
              completed: data.progress.completed,
              completed_message: data.progress.completed
                ? client.language.getString("ECONOMY_QUEST_PARTIAL_COMPLETE", interaction.guild?.id, {
                    completed: data.progress.completed
                  })
                : ""
            })
          )
          .setFooter({
            text: client.language.getString("FOOTER_COPYRIGHT", interaction.guild?.id, {
              user_tag: interaction.user.tag,
              year: new Date().getFullYear()
            }),
            iconURL: interaction.user.avatarURL({ dynamic: true }),
          })
          .setTimestamp();
        return interaction.reply({ embeds: [NotNow] });
      } else if (data.progress.claimed) {
        return interaction.reply({
          content: client.language.getString("ECONOMY_QUEST_ALREADY_CLAIMED", interaction.guild?.id, { 
            username: interaction.user.tag 
          })
        });
      }
      let moneyget = Math.floor(500);
      const rewardables = market.filter((x) => ![5, 20].includes(x.id));
      const item = rewardables[Math.floor(Math.random() * rewardables.length)];
      itemreward = false;
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
            .setTitle(client.language.getString("ECONOMY_QUEST_CLAIM_TITLE", interaction.guild?.id))
            .setDescription(
              client.language.getString("ECONOMY_QUEST_CLAIM_DESC", interaction.guild?.id, {
                username: interaction.user.tag,
                amount: Math.floor(moneyget),
                item_reward: itemreward
                  ? client.language.getString("ECONOMY_QUEST_ITEM_REWARD", interaction.guild?.id, {
                      item_name: item.name,
                      item_desc: item.description
                    })
                  : ""
              })
            )
            .setFooter({
              text: client.language.getString("ECONOMY_QUEST_CLAIM_FOOTER", interaction.guild?.id),
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
            content: client.language.getString("ECONOMY_DB_SAVE_ERROR", interaction.guild?.id, { 
              error: err.message 
            }),
            ephemeral: true
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
          .setTitle(client.language.getString("ECONOMY_QUEST_TITLE", interaction.guild?.id))
          .setDescription(
            client.language.getString("ECONOMY_QUEST_DESCRIPTION", interaction.guild?.id, {
              refresh_time: moment.duration(data.progress.TimeReset - now, "milliseconds").format("hh:mm:ss"),
              completed: data.progress.completed,
              prefix: client.prefix
            })
          )
          .setThumbnail("attachment://treasure.png")
          .setFooter({
            text: client.language.getString("FOOTER_COPYRIGHT", interaction.guild?.id, {
              user_tag: interaction.user.tag,
              year: new Date().getFullYear()
            }),
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
                    client.language.getString("ECONOMY_QUEST_NAME_FORMAT", interaction.guild?.id, {
                      quest_name: quest.name,
                      current: dataquest.current,
                      total: dataquest.progress
                    }),
                  value: client.language.getString("ECONOMY_QUEST_REWARDS", interaction.guild?.id, {
                    amount: quest.reward
                  }),
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
